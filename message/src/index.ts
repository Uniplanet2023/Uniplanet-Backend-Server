import morgan from 'morgan'
import { Server as SocketIOServer, Socket } from 'socket.io'
import app from './app'
import { URL_LIST_PROD, kafkaClient, redisClient, tokenValidation } from '@uniplanet-lib/common'
import { MessageCreatedProducer } from './event/producer/MessageCreatedProducer'
import { MessageReadProducer } from './event/producer/MessageReadProducer'
import { MessageReadAllProducer } from './event/producer/MessageReadAllProducer'
import admin from 'firebase-admin'
import { creatingChatNotification, newMessageNotification } from './event/notification'
app.use(morgan('tiny'))

admin.initializeApp({
	credential: admin.credential.cert({
		privateKey: process.env.FIREBASE_PRIVATE_KEY!.replace(/\\n/g, '\n'),
		clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
		projectId: process.env.FIREBASE_PROJECT_ID,
	}),
})
const { PORT = 3004, NODE_ENV, KAFKA_BROKER } = process.env
// Sold / onSale / fre
// Creating and configuring Kafka client
if (NODE_ENV === 'production') {
	if (!KAFKA_BROKER) {
		throw new Error('KAFKA_BROKER have to be define')
	}
}
kafkaClient.create('my-app', [process.env.KAFKA_BROKER! as string])
const messageCreateProvider = new MessageCreatedProducer(kafkaClient.kafka)
const messageReadAllProvider = new MessageReadAllProducer(kafkaClient.kafka)
const messageReadProvider = new MessageReadProducer(kafkaClient.kafka)

const server = app.listen(PORT, async () => {
	console.log(`BackEnd Connection : BackEnd Server connected at port ${PORT}`)
	await messageCreateProvider.connect()
	await messageReadAllProvider.connect()
	await messageReadProvider.connect()

	await redisClient.create(process.env.REDIS_HOST!, parseInt(process.env.REDIS_PORT!))
	redisClient.redis.on('error', err => console.log('Redis Client Error', err))
	await redisClient.redis.connect().then(() => {
		console.log('Redis is connected')
	})
})

let io: SocketIOServer
io = new SocketIOServer(server, {
	pingTimeout: 60000,
	pingInterval: 25000,
	cookie: false,
	cors: {
		origin: URL_LIST_PROD,
		credentials: true,
	},
})
declare module 'socket.io' {
	interface Socket {
		userId: string
		chatRoomId: string[]
		firebaseToken: string
	}
}

io.use((socket, next) => {
	const { userId } = socket.handshake.query
	if (!userId) {
		return next(new Error('Authentication error'))
	}
	socket.userId = userId as string
	socket.chatRoomId = []
	next()
})
io.on('connection', socket => {
	console.log('User connected')

	socket.on('setup', firebaseToken => {
		console.log('setup' + socket.userId)
		socket.join(socket.userId)
		if (!firebaseToken) {
			console.log('firebase token not found')
			return
		}
		try {
			redisClient.redis.sAdd(`Online User`, socket.userId)
			redisClient.redis.set(socket.userId, firebaseToken)
		} catch (err) {
			console.log(err)
		}
	})

	socket.on('typing', chatRoomId => {
		console.log('typing')
		io.to(chatRoomId).emit('typing', chatRoomId, socket.userId)
	})
	socket.on('stop typing', chatRoomId => {
		console.log('stop typing')
		io.to(chatRoomId).emit('stop typing', chatRoomId)
	})
	socket.on('chat room created', (chatJson, existingChat, callback) => {
		const chat = JSON.parse(chatJson)

		socket.chatRoomId.push(chat.id)

		socket.join(chat.id)
		socket.join(chat.seller.id)

		io.to(chat.seller.id).emit('chat room created', chatJson, existingChat)

		redisClient.redis.sIsMember(`Online User`, chat.seller.id).then(async isOnline => {
			const receiverToken = await redisClient.redis.get(chat.seller.id)
			if (!receiverToken) {
				return
			}

			const notification = creatingChatNotification(receiverToken, chatJson, chat)
			admin
				.messaging()
				.send(notification)
				.then(response => {
					console.log('Successfully sent message:', response)
				})
				.catch(error => {
					console.log('Error sending message:', error)
				})
			callback(isOnline)
		})
	})
	socket.on('chat room deleted', async (chatRoom, callback) => {
		console.log('Deleting chat room:', chatRoom)

		// Check if the current user is authorized to delete the chat room (optional)
		// Example: Check if the user is the owner of the chat room
		// This logic depends on how you handle chat room ownership or admin rights

		// Notify all users in the chat room that it will be deleted

		// Perform the deletion of the chat room from the database or your storage system
		// Example: Delete chat room from your database
		try {
			// Placeholder for deletion logic, replace with actual database deletion code
			// await ChatRoom.deleteOne({ _id: chatRoomId });
			// Leave all users from this chat room and remove it from their list
			socket.leave(chatRoom)
			io.to(chatRoom).emit('chat room deleted', { chatRoom })
			const index = socket.chatRoomId.indexOf(chatRoom)
			if (index > -1) {
				socket.chatRoomId.splice(index, 1)
			}

			// Callback with success message
			callback({ success: true, message: 'Chat room deleted successfully' })
		} catch (error) {
			console.log('Error deleting chat room:', error)
			callback({ success: false, message: 'Error deleting chat room' })
		}
	})

	socket.on('join chat', ({ chatRoomId, targetUser }, callback) => {
		console.log('join chat' + chatRoomId)
		socket.join(chatRoomId)

		socket.chatRoomId.push(chatRoomId)
		redisClient.redis.sIsMember(`Online User`, targetUser).then(isOnline => {
			callback(isOnline) // Respond back to the requester with the online status
		})

		io.to(chatRoomId).emit('online user', socket.userId)
	})
	socket.on('new message', async ({ messageJson, senderJson }, callback) => {
		const message = JSON.parse(messageJson)

		io.to(message.chat).emit('message received', messageJson)
		const receiverToken = await redisClient.redis.get(message.receiver)
		if (!receiverToken) {
			console.log('receiver token not found')
			callback('token not found')
		}else{
			redisClient.redis.sIsMember(`Online User`, message.receiver).then(isOnline => {
				if (!isOnline) {
					console.log('sening notification')
					const messageNotification = newMessageNotification(receiverToken, message, messageJson, senderJson);
	
					admin
						.messaging()
						.send(messageNotification)
						.then(response => {
							console.log('Successfully sent message:', response)
						})
						.catch(error => {
							console.log('Error sending message:', error)
						})
				}
			})
		}

		

		messageCreateProvider.sendMessage(message)

		callback(message)
	})
	socket.on('read all message', chatId => {
		const readMessageTime = new Date()
		io.to(chatId).emit('read all message', { sender: socket.userId, chatId, readMessageTime })
		messageReadAllProvider.sendMessage({ sender: socket.userId, chat: chatId, readDate: readMessageTime })
	})

	// Handle a request to check if a user is online
	socket.on('check user online', (checkUserId, callback) => {
		redisClient.redis.sIsMember(`Online User`, checkUserId).then(isOnline => {
			callback(isOnline) // Respond back to the requester with the online status
		})
	})

	socket.on('disconnect', () => {
		console.log('User disconnected')
		redisClient.redis.sRem(`Online User`, socket.userId)

		socket.chatRoomId.forEach((chatRoomId: string) => {
			io.to(chatRoomId).emit('offline user', socket.userId)
			socket.leave(chatRoomId)
		})
		socket.leave(socket.userId)
		socket.firebaseToken = ''
		socket.chatRoomId = []
	})
})

import { kafkaClient, redisClient } from '@uniplanet-lib/common'
import admin from 'firebase-admin'
import { creatingChatNotification } from './event/notification'
import {
	initializeFirebase,
	initializeKafka,
	initializeProducer,
	initializeRedis,
	messageCreateProvider,
	messageReadAllProvider,
	userUpdateProvider,
} from './config'
import { initMiddleWare } from './socket/middleware/socket-init'
import { Server as SocketIOServer } from 'socket.io'
import { URL_LIST_PROD } from '@uniplanet-lib/common'
import app from './app'

const { PORT = 3004 } = process.env
declare module 'socket.io' {
	interface Socket {
		userId: string
		chatRoomId: string[]
	}
}
const server = app.listen(PORT, async () => {
	console.log(` BackEnd Connection : BackEnd Server connected at port ${PORT}`)
	initializeFirebase()
	initializeKafka()
	await initializeProducer(kafkaClient.kafka)
	await initializeRedis()
})

export const io = new SocketIOServer(server, {
	pingTimeout: 60000,
	pingInterval: 25000,
	cookie: false,
	cors: {
		origin: URL_LIST_PROD,
		credentials: true,
	},
})
// Socket Programming
// 1. init Setting
initMiddleWare()
// 2. Socket Router
io.on('connection', async socket => {
	console.log('User connected')
	try {
		if (socket.userId) {
			redisClient.redis.sAdd(`Online User`, socket.userId)
			socket.join(socket.userId)

			// Retrieve chat rooms from Redis
			const chatList = await redisClient.redis.sMembers(`Chat: ${socket.userId}`)

			if (chatList) {
				chatList.forEach(chatRoomId => {
					// Check if the socket is already in the chat room
					socket.join(chatRoomId)
					io.to(chatRoomId).emit('online user', socket.userId)
					socket.chatRoomId.push(chatRoomId)
				})
			}
		}
	} catch (err) {
		console.error('Error handling socket connection and chat rooms:', err)
	}

	socket.on('setup', firebaseToken => {
		console.log('setup')
		if (!firebaseToken) {
			console.log('firebase token not found')
			return
		}
		try {
			redisClient.redis.set(`firebaseToken:${socket.userId}`, firebaseToken)
		} catch (e) {
			console.log(e)
		}
	})

	socket.on('typing', chatRoomId => {
		io.to(chatRoomId).emit('typing', chatRoomId, socket.userId)
	})
	socket.on('stop typing', chatRoomId => {
		io.to(chatRoomId).emit('stop typing', chatRoomId)
	})
	socket.on('chat room created', async (chatJson, existingChat, callback) => {
		try {
			const chat = JSON.parse(chatJson);
	
			// Join chat rooms only if the socket is not already in them
			if (!socket.rooms.has(chat.id)) {
				socket.chatRoomId.push(chat.id);
				socket.join(chat.id);
				redisClient.redis.sAdd(`Chat: ${socket.userId}`, chat.id);
				io.to(chat.seller.id).emit('chat room created', chatJson, existingChat);
			} else {
				console.log(`Socket already in chat room: ${chat.id}`);
			}
	
			if (!socket.rooms.has(chat.seller.id)) {
				socket.join(chat.seller.id);
			} else {
				console.log(`Socket already in seller's room: ${chat.seller.id}`);
			}
	
			// Log the type and value of chat.seller.id
			console.log(`chat.seller.id: ${chat.seller.id} (type: ${typeof chat.seller.id})`);
	
			// Check if the seller is online and send notification if not
			const isOnline = await redisClient.redis.sIsMember('Online User', chat.seller.id);
			callback(isOnline);
	
			// Send notification to seller if they are offline
			const receiverToken = await redisClient.redis.get(`firebaseToken:${chat.seller.id}`);
			if (receiverToken) {
				try {
					const notification = creatingChatNotification(receiverToken, chatJson, chat.buyer);
					const response = await admin.messaging().send(notification);
					console.log('Successfully sent message:', response);
				} catch (error) {
					console.error('Error sending message:', error);
				}
			}
		} catch (error) {
			console.error('Error processing chat room creation:', error);
		}
	});
	socket.on('chat room deleted', async ({ chatRoom, clientId }, callback) => {
		console.log('Deleting chat room:', chatRoom)
		try {
			await socket.leave(chatRoom)
			io.to(chatRoom).emit('chat room deleted', { chatRoom, clientId })

			// Assuming socket.chatRoomId is an array storing the user's chat rooms
			const index = socket.chatRoomId.indexOf(chatRoom)
			if (index > -1) {
				socket.chatRoomId.splice(index, 1)
			}

			// Remove chat room from Redis for both users
			await redisClient.redis.sRem(`Chat: ${socket.userId}`, chatRoom) // My chat room
			await redisClient.redis.sRem(`Chat: ${clientId}`, chatRoom) // Other user's chat room

			// Callback with success message
			callback({ success: true, message: 'Chat room deleted successfully' })
		} catch (error) {
			console.error('Error deleting chat room:', error)
			callback({ success: false, message: 'Error deleting chat room' })
		}
	})

	socket.on('join chat', async ({ chatRoomId, targetUser }, callback) => {
		try {
			// Only join the chat room if the socket is not already a member
			if (!socket.rooms.has(chatRoomId)) {
				socket.join(chatRoomId)
				await redisClient.redis.sAdd(`Chat: ${socket.userId}`, chatRoomId)

				// Track chat rooms in a user-specific array, if not already tracked
				if (!socket.chatRoomId.includes(chatRoomId)) {
					socket.chatRoomId.push(chatRoomId)
				}
			} else {
				console.log(`Socket already in chat room: ${chatRoomId}`)
			}

			// Broadcast to the chat room that this user is online
			io.to(chatRoomId).emit('online user', socket.userId)

			// Check online status of the target user and send it back to the requester
			const isOnline = await redisClient.redis.sIsMember(`Online User`, targetUser)
			callback(isOnline)
		} catch (error) {
			console.error('Error in join chat:', error)
		}
	})
	socket.on('new message', async ({ messageJson,senderJson }, callback) => {
		const message = JSON.parse(messageJson)
		
		try {
			io.to(message.chat).emit('message received', {messageJson, senderJson})
			userUpdateProvider.sendMessage({ id: message.receiver, unSeenMessages: 1 })
			messageCreateProvider.sendMessage(message)
			callback(message)
		} catch (e) {
			console.log(e)
		}
	})
	socket.on('read all message', async chatId => {
		try {
			const readMessageTime = new Date()
			io.to(chatId).emit('read all message', { sender: socket.userId, chatId, readMessageTime })
			messageReadAllProvider.sendMessage({ sender: socket.userId, chat: chatId, readDate: readMessageTime })
		} catch (e) {
			console.log(e)
		}
	})

	// Handle a request to check if a user is online
	socket.on('check user online', (checkUserId, callback) => {
		try {
			redisClient.redis.sIsMember(`Online User`, checkUserId).then(isOnline => {
				callback(isOnline) // Respond back to the requester with the online status
			})
		} catch (e) {
			console.log(e)
		}
	})

	socket.on('disconnect', () => {
		console.log('User disconnected: ' + socket.userId)
		redisClient.redis.sRem(`Online User`, socket.userId)

		socket.chatRoomId.forEach((chatRoomId: string) => {
			io.to(chatRoomId).emit('offline user', socket.userId)
			socket.leave(chatRoomId)
		})
		socket.leave(socket.userId)
	})
})

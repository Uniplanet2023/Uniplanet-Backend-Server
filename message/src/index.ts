import morgan from 'morgan'
import { Server as SocketIOServer, Socket } from 'socket.io'
import app from './app'
import { URL_LIST_PROD, kafkaClient, redisClient, tokenValidation } from '@uniplanet-lib/common'
import { MessageCreatedProducer } from './event/producer/MessageCreatedProducer'
import { MessageReadProducer } from './event/producer/MessageReadProducer'
import { MessageReadAllProducer } from './event/producer/MessageReadAllProducer'
import admin from 'firebase-admin'
app.use(morgan('tiny'))

admin.initializeApp({
	credential: admin.credential.cert({
		privateKey: process.env.FIREBASE_PRIVATE_KEY!.replace(/\\n/g, '\n'),
		clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
		projectId: process.env.FIREBASE_PROJECT_ID,
	}),
});
const { PORT = 3004, NODE_ENV, KAFKA_BROKER, REDIS_HOST, REDIS_PORT, MONGO_DB_HOST } = process.env
// Sold / onSale / fre
// Creating and configuring Kafka client
if (NODE_ENV === 'production') {
	if (!KAFKA_BROKER) {
		throw new Error('KAFKA_BROKER have to be define')
	}
}
kafkaClient.create('my-app', [process.env.KAFKA_BROKER! as string])
const messageCreateProvider = new MessageCreatedProducer(kafkaClient.kafka);
const messageReadAllProvider = new MessageReadAllProducer(kafkaClient.kafka);
const messageReadProvider = new MessageReadProducer(kafkaClient.kafka);
                  
const server = app.listen(PORT, async () => {
	console.log(`BackEnd Connection : BackEnd Server connected at port ${PORT}`)
	await messageCreateProvider.connect();
	await messageReadAllProvider.connect();
	await messageReadProvider.connect();
	
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
		school: string
		chatRoomId: string[]
		firebaseToken: string
	}
}

io.use((socket, next) => {
	const {userId, school} = socket.handshake.query
	if (!userId || !school) {
		return next(new Error('Authentication error'))
	}
	socket.userId = userId as string;
	socket.school = school as string;
	socket.chatRoomId = [];
	next()
})
io.on('connection', socket => {
	console.log('User connected')
	

	socket.on('setup', (firebaseToken) => {
		console.log('setup');
		if(!firebaseToken){
			console.log('firebase token not found');
			return;
		}
		try{
			redisClient.redis.sAdd(`${socket.school} Online User`, socket.userId);
			redisClient.redis.set(socket.userId, firebaseToken);
		}catch(err){
			console.log(err);
		}
	})
	
	socket.on('typing', chatRoomId => {
		console.log('typing')
		io.to(chatRoomId).emit('typing', chatRoomId)
	})
	socket.on('stop typing', chatRoomId => {
		console.log('stop typing')
		io.to(chatRoomId).emit('stop typing', chatRoomId)
	})
	socket.on('chat room created', ({messageJson,senderJson}, callback) => {
		const message = JSON.parse(messageJson);
		const sender = JSON.parse(senderJson);
		console.log('chat room created')
		socket.join(message.chat)
		redisClient.redis.sIsMember(`${socket.school} Online User`,message.receiver).then(async isOnline => {
			console.log('==============user is online=======================');
			const receiverToken = await redisClient.redis.get(message.receiver);
		if(!receiverToken){
			console.log('receiver token not found');
			callback('token not found');
			return;
		}
		const notification ={
			data: {
				message:JSON.stringify(message),
				sender: JSON.stringify(sender),
			},
			apns:{
				headers:{
					"apns-priority": "5",
					"apns-push-type": "background",
					"apns-topic":"com.example.uniplanetMobile"
				},
				payload:{
					aps:{
						"content-available": 1,
					}
				}
			},
			token: receiverToken
		}
		admin.messaging().send(notification).then((response) => {
			console.log('Successfully sent message:', response);
		}).catch((error) => {
			console.log('Error sending message:', error);
		});
		callback(isOnline);
		});
	});
	
	socket.on('join chat', ({chatRoomId,targetUser}, callback) => {
		console.log('join chat' + chatRoomId);
		socket.join(chatRoomId)

		socket.chatRoomId.push(chatRoomId);
		redisClient.redis.sIsMember(`${socket.school} Online User`,targetUser ).then(isOnline => {
			
			callback(targetUser, isOnline); // Respond back to the requester with the online status
		});

		io.to(chatRoomId).emit('online user', socket.userId);
	})
	socket.on('new message', async ({messageJson,senderJson},callback) => {
		const message = JSON.parse(messageJson);
		const sender = JSON.parse(senderJson);
		
		io.to(message.chat).emit('message received', messageJson)
		const receiverToken = await redisClient.redis.get(message.receiver);
		if(!receiverToken){
			console.log('receiver token not found');
			callback('token not found');
			return;
		}
		const notification ={
			data: {
				message:JSON.stringify(message),
				sender: JSON.stringify(sender),
			},
			apns:{
				headers:{
					"apns-priority": "5",
					"apns-push-type": "background",
					"apns-topic":"com.example.uniplanetMobile"
				},
				payload:{
					aps:{
						"content-available": 1,
					}
				}
			},
			token: receiverToken
		}
		admin.messaging().send(notification).then((response) => {
			console.log('Successfully sent message:', response);
		}).catch((error) => {
			console.log('Error sending message:', error);
		});
		messageCreateProvider.sendMessage(message);

		callback(message);
	})
	socket.on('read all message', (chatId) => {
		const readMessageTime = new Date();
		io.to(chatId).emit('read all message', {sender: socket.userId,chatId, readMessageTime});
		messageReadAllProvider.sendMessage({sender: socket.userId, chat: chatId, readDate: readMessageTime});
	})
	// socket.on('read message', (chatId, messageId) => {
	// 	console.log('read message');
	// 	const readMessageTime = new Date();
	// 	io.to(chatId).emit('read message', {chatId, messageId, readMessageTime});
	// 	messageReadProvider.sendMessage({messageId: messageId,readDate: readMessageTime});
	// });
	// Handle a request to check if a user is online
	socket.on('check user online', (checkUserId, callback) => {
		redisClient.redis.sIsMember(`${socket.school} Online User`, checkUserId).then(isOnline => {
			callback(isOnline); // Respond back to the requester with the online status
		});
	});

	socket.on('disconnect', () => {
		console.log('User disconnected')
		redisClient.redis.sRem('onlineUsers', socket.userId);

		socket.chatRoomId.forEach((chatRoomId: string) => {
			io.to(chatRoomId).emit('offline user', socket.userId)
			socket.leave(chatRoomId)
		})
	})
})

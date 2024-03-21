import morgan from 'morgan'
import { Server as SocketIOServer, Socket } from 'socket.io'
import app from './app'
import { URL_LIST_PROD, kafkaClient, redisClient, tokenValidation } from '@uniplanet-lib/common'
import jwt, { JwtPayload } from 'jsonwebtoken'
import { MessageCreatedProducer } from './event/producer/MessageCreatedProducer'
app.use(morgan('tiny'))

const { PORT = 3004, NODE_ENV, KAFKA_BROKER, REDIS_HOST, REDIS_PORT, MONGO_DB_HOST } = process.env

// Creating and configuring Kafka client
if (NODE_ENV === 'production') {
	if (!KAFKA_BROKER) {
		throw new Error('KAFKA_BROKER have to be define')
	}
}
kafkaClient.create('my-app', [process.env.KAFKA_BROKER! as string])
const messageCreateProvider = new MessageCreatedProducer(kafkaClient.kafka);
		
const server = app.listen(PORT, async () => {
	console.log(`BackEnd Connection : BackEnd Server connected at port ${PORT}`)
	await messageCreateProvider.connect();
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
		roomIds: string[]
	}
}

io.use((socket, next) => {
	const userId = socket.handshake.query.userId
	if (!userId) {
		return next(new Error('Authentication error'))
	}
	socket.userId = userId as string;
	socket.roomIds = [];
	console.log(socket.userId);
	next()
})
io.on('connection', socket => {
	console.log('User connected')
	

	socket.on('setup', async (jsonRoom, callback) => {
		const chatRooms = JSON.parse(jsonRoom);
		console.log('my id ' + socket.userId);
		chatRooms.forEach((room: string) => {
			console.log(room);
			const roomObj:Room = JSON.parse(room);
			socket.roomIds.push(roomObj.id);
			redisClient.redis.sAdd('onlineUsers', socket.userId);
			io.to(roomObj.id).emit('online user', socket.userId);
			socket.join(roomObj.id)
			if(roomObj.buyer.id != socket.userId) {
				redisClient.redis.sIsMember('onlineUsers',roomObj.buyer.id ).then(isOnline => {
					callback(roomObj.buyer.id, isOnline); // Respond back to the requester with the online status
				});
				console.log('target user id ' + roomObj.buyer.id);
			}else{
				redisClient.redis.sIsMember('onlineUsers',roomObj.seller.id ).then(isOnline => {
					callback(roomObj.seller.id, isOnline); // Respond back to the requester with the online status
				});
				console.log('target user id ' + roomObj.seller.id);
			}
			
			console.log('User joined :' + room)
		});
		
	})
	
	socket.on('typing', room => {
		console.log('typing')
		console.log('room')
		io.to(room).emit('typing', room)
	})
	socket.on('stop typing', room => {
		console.log('stop typing')
		console.log('room')
		io.to(room).emit('stop typing', room)
	})
	socket.on('join chat', room => {
		socket.join(room)
		console.log('User joined :' + room)
	})
	socket.on('new message', newMessageReceived => {
		const msg = JSON.parse(newMessageReceived);
		console.log('new message'+ msg);
		
		messageCreateProvider.sendMessage(msg);

		io.to(msg.chat).emit('message received', newMessageReceived)
	})
	// Handle a request to check if a user is online
	socket.on('check user online', (checkUserId, callback) => {
		redisClient.redis.sIsMember('onlineUsers', checkUserId).then(isOnline => {
			callback(isOnline); // Respond back to the requester with the online status
		});
	});

	socket.off('setup', userId => {
		console.log('user offline')
		socket.leave(userId)
		socket.userId = '';
	})
	socket.on('disconnect', () => {
		console.log('User disconnected')
		redisClient.redis.sRem('onlineUsers', socket.userId);

		socket.roomIds.forEach((room: string) => {
			io.to(room).emit('offline user', socket.userId)
			socket.leave(room)
		})
	})
})

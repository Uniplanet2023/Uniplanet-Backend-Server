import morgan from 'morgan'
import { Server as SocketIOServer, Socket } from 'socket.io'
import app from './app'
import { URL_LIST_PROD, kafkaClient, tokenValidation } from '@uniplanet-lib/common'
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
})

let io: SocketIOServer
const userSocketIds: Record<string, string> = {}
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
	}
}

io.use((socket, next) => {
	const userId = socket.handshake.query.userId
	if (!userId) {
		return next(new Error('Authentication error'))
	}
	socket.userId = userId as string;
	console.log(socket.userId);
	next()
})
io.on('connection', socket => {
	console.log('User connected')
	socket.on('setup', (_) => {
		console.log('user online');
		socket.join(socket.userId)
		socket.broadcast.emit('online user', socket.userId)
		
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
		socket.join(room as string)
		console.log('User joined :' + room)
	})
	socket.on('new message', newMessageReceived => {
		console.log('new message'+ newMessageReceived);
		var room = newMessageReceived.chat
		
		console.log('room' + room)
		
		messageCreateProvider.sendMessage(newMessageReceived);

		io.to(room).emit('message received', newMessageReceived)
		// socket.to(room).emit('message sent', 'New Message')
	})

	socket.off('setup', userId => {
		console.log('user offline')
		socket.leave(userId)
		socket.userId = '';
	})
	socket.on('disconnect', () => {
		console.log('User disconnected')
	})
})

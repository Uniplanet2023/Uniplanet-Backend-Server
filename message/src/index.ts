import morgan from 'morgan'
import { kafkaClient } from './kafka-client'
import { redisClient } from './redis-client'
import { Server as SocketIOServer, Socket } from 'socket.io'
import app from './app';

app.use(morgan('tiny'));

const {
	PORT = 3004,
	NODE_ENV,
	KAFKA_BROKER,
	REDIS_HOST,
	REDIS_PORT,
	MONGO_DB_HOST,
  } = process.env;

// Creating and configuring Kafka client
if(NODE_ENV === 'production'){
	if(!KAFKA_BROKER){
		throw new Error('KAFKA_BROKER have to be define')
	}	
} 
kafkaClient.create('my-app', [process.env.KAFKA_BROKER! as string])
const server = app.listen(PORT,async () => {
	console.log(`BackEnd Connection : BackEnd Server connected at port ${PORT}`)
})

let io: SocketIOServer
const userSocketIds: Record<string, string> = {}
io = new SocketIOServer(server,{
	pingTimeout: 60000,
	pingInterval: 25000,
	cookie: false,
	cors:{
		origin: [
			'http://auth.uniplanet-back.autos',
			'http://products.uniplanet-back.autos',
			'http://account.uniplanet-back.autos',
			'http://chat.uniplanet-back.autos',
			'http://message.uniplanet-back.autos'
		],
		credentials: true,
	}
});
io.use((socket: Socket, next) => {
	const { headers } = socket.handshake
});

io.on('connection', (socket) => {
	console.log('User connected')
	socket.on('disconnect', () => {
		console.log('User disconnected')
	})
	socket.on('join', (userId: string) => {
		userSocketIds[userId] = socket.id
	})
	socket.on('message', (message) => {
		const { to, from, text } = message
		const toSocketId = userSocketIds[to]
		if (toSocketId) {
			io.to(toSocketId).emit('message', { from, text })
		}
	})
});
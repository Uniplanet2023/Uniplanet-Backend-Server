import morgan from 'morgan'
import { kafkaClient } from './kafka-client'
import { redisClient } from './redis-client'
import { Server as SocketIOServer, Socket } from 'socket.io'
import app from './app';
import { tokenValidation } from '@uniplanet-lib/common';
import jwt, { JwtPayload } from 'jsonwebtoken'
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
		methods: ['GET', 'POST'],
		credentials: true,
	}
});
declare module 'socket.io' {
	interface Socket {
		user: JwtPayload;
	}
}

io.use((socket, next) => {
	const token = socket.handshake.query.session_token;
	const payload = jwt.verify(token as string, process.env.JWT_TOKEN_SECRET as string);
	socket.user = payload as JwtPayload;
	if(!socket.user){
		return next(new Error('Authentication error'));
	}
	next();
});
io.on('connection', (socket) => {
	console.log('User connected')
	socket.on('setup',(userId)=>{
		socket.join(userId);
		socket.broadcast.emit('online-user',userId)
		console.log(userId);
	})
	socket.on('typing',(room)=>{
		console.log('typing');
		console.log('room');
		socket.to(room).emit('typing',room)
	})
	socket.on('stop typing',(room)=>{
		console.log('stop typing');
		console.log('room');
		socket.to(room).emit('stop typing',room)
	})
	socket.on('join chat', (room) => {
		socket.join(room)
		console.log('User joined :' + room);
	})
	socket.on('new message', (newMessageReceived) => {
		var chat = newMessageReceived.chat;
		var room = chat._id;
		var sender = newMessageReceived.sender;
		if(!sender || !sender._id){
			console.log('Sender not found');
			return;
		}
		var senderId = sender._id;
		console.log(senderId + " sent message to " + room);
		const users = chat.users;
		if(!users){
			console.log('User not found');
			return;
		}
		socket.to(room).emit('message receive', newMessageReceived);
		socket.to(room).emit('message sent', "New Message");
	});

	socket.off('setup',(userId) =>{
		console.log('user offline');
		socket.leave(userId);
	})
	socket.on('disconnect', () => {
		console.log('User disconnected')
	})
});
io.on('disconnect', (socket) => {
	console.log('User disconnected')
	socket.user = null;
}
)
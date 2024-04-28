import { redisClient } from '@uniplanet-lib/common'
import admin from 'firebase-admin'
import { creatingChatNotification, newMessageNotification } from './event/notification'
import { initializeFirebase, initializeKafka, messageCreateProvider, messageReadAllProvider } from './config'
import { io } from './config/socket'
import { initMiddleWare } from './socket/middleware/socket-init'

//initial Setting
initializeFirebase();
initializeKafka();

// Socket Programming
// 1. init Setting
initMiddleWare();
// 2. Socket Router
io.on('connection', socket => {
	console.log('User connected')
	try {
		if(socket.userId){
			console.log(socket.userId);
			redisClient.redis.sAdd(`Online User`, socket.userId)
			socket.join(socket.userId)
			redisClient.redis.sMembers(`Chat: ${socket.userId}`).then( async chatList =>{
				console.log(chatList);
				if(chatList){
					chatList.forEach((chatRoomId: string) => {
						socket.join(chatRoomId);
						io.to(chatRoomId).emit('online user', socket.userId)
						
					})
				}
			})
			
			
		}
	} catch (err) {
		console.log(err)
	}
	socket.on('setup', firebaseToken => {
		console.log('setup' + socket.userId)
		socket.firebaseToken = firebaseToken
		console.log(socket.firebaseToken);
		if (!firebaseToken) {
			console.log('firebase token not found')
			return
		}
		try {
			redisClient.redis.set(socket.userId, firebaseToken)
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
	socket.on('chat room created', (chatJson, existingChat, callback) => {
		const chat = JSON.parse(chatJson)

		socket.chatRoomId.push(chat.id)

		socket.join(chat.id)
		socket.join(chat.seller.id)
		redisClient.redis.sAdd(`Chat: ${socket.userId}`, chat.id);
		io.to(chat.seller.id).emit('chat room created', chatJson, existingChat)
 
		redisClient.redis.sIsMember(`Online User`, chat.seller.id).then(async isOnline => {
			const receiverToken = await redisClient.redis.get(chat.seller.id)
			
			callback(isOnline);
			try{
				if(receiverToken){
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
				}
				
			
		
			}catch(e){
				console.log(e);
			}
		})	
	})
	socket.on('chat room deleted', async ({chatRoom, clientId}, callback) => {
		console.log('Deleting chat room:', chatRoom);
		try {
			await socket.leave(chatRoom);
			io.to(chatRoom).emit('chat room deleted', { chatRoom });
	
			// Assuming socket.chatRoomId is an array storing the user's chat rooms
			const index = socket.chatRoomId.indexOf(chatRoom);
			if (index > -1) {
				socket.chatRoomId.splice(index, 1);
			}
	
			// Remove chat room from Redis for both users
			await redisClient.redis.sRem(`Chat: ${socket.userId}`, chatRoom);
			await redisClient.redis.sRem(`Chat: ${clientId}`, chatRoom);
	
			// Callback with success message
			callback({ success: true, message: 'Chat room deleted successfully' });
		} catch (error) {
			console.error('Error deleting chat room:', error);
			callback({ success: false, message: 'Error deleting chat room' });
		}
	});
	

	socket.on('join chat', ({ chatRoomId, targetUser }, callback) => {
		console.log('join chat' + chatRoomId)
		socket.join(chatRoomId)
		redisClient.redis.sAdd(`Chat: ${socket.userId}`, chatRoomId);
		socket.chatRoomId.push(chatRoomId)
		redisClient.redis.sIsMember(`Online User`, targetUser).then(isOnline => {
			callback(isOnline) // Respond back to the requester with the online status
		})

		io.to(chatRoomId).emit('online user', socket.userId)
	})
	socket.on('new message', async ({ messageJson, senderJson }, callback) => {
		const message = JSON.parse(messageJson)
		try {
			io.to(message.chat).emit('message received', messageJson)
			const receiverToken = await redisClient.redis.get(message.receiver)
			
				redisClient.redis.sIsMember(`Online User`, message.receiver).then(isOnline => {
					if (!isOnline) {
						console.log('sening notification')
						const msg = message.message as string
						if (msg.startsWith('https://res.cloudinary.com/dtgmmfv3d/')) {
							message.message = 'Image'
						}
						try{
							if(receiverToken){
								console.log(receiverToken);
								const messageNotification = newMessageNotification(receiverToken, message, messageJson, senderJson)

							admin
								.messaging()
								.send(messageNotification)
								.then(response => {
									console.log('Successfully sent message:', response)
								})
								.catch(error => {
									console.log('Error sending message:', error)
								})
							}else{
								console.log('receiverToken not found')
							}
							
						}catch(e){
							console.log(e);
						}
						
					}
				})
			

			messageCreateProvider.sendMessage(message)

			callback(message)
		} catch (e) {
			console.log(e)
		}
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
	})
})

import { Server as SocketIOServer, Socket } from 'socket.io'
import { verify } from 'jsonwebtoken'
import mongoose from 'mongoose'
import { Server as HTTPServer } from 'http'
import { Message, ChatRoom, UserChatRoom } from '../models' // Update the path according to your project structure
import { logStart, logEnd } from '../functions/log_function' // Update the path according to your project structure

interface UserData {
	user?: string
	token?: string
	chatRoomList: string[]
}

let io: SocketIOServer
const userSocketIds: Record<string, string> = {}
let userData: UserData

const socketInit = (httpServer: HTTPServer): SocketIOServer => {
	io = new SocketIOServer(httpServer)

	io.use((socket: Socket, next) => {
		logStart('Socket Middleware')

		const { headers } = socket.handshake

		try {
			console.log('1. Getting Token from header')
			const token = headers['x-auth-token'] as string
			if (!token) {
				console.log('No token')
				next(new Error('No token provided'))
				return
			}
			console.log('2. Token Verification')
			const verified = verify(token, 'passwordKey') as { id: string }
			if (!verified) {
				console.log('Token verification failed, authorization denied.')
				next(new Error('Token verification failed'))
				return
			}
			console.log('3. Setting User Id into the Socket')

			userData.user = verified.id // User ID
			userData.token = token
			userData.chatRoomList = []

			logEnd('Socket Middleware')
			next()
		} catch (err) {
			console.error('\x1b[31m Middle Ware Auth has issues!! \x1b[0m')
			console.error(err)
		}
	})
	const isUserInChatRoom = async (chatRoomId: string) => {
		// Get the room's data
		const sockets = await io.in(chatRoomId).fetchSockets() // let you know who is joining the certain chat room
		const userList: string[] = []
		sockets.forEach(e => {
			console.log(e)
			userList.push(e.rooms.values.arguments)
		})

		console.log(`isUserInChatRoom ${userList}`)
		return userList // User is not in the chat room
	}
	// socket API
	io.on('connection', socket => {
		socket.on('joinChatRoom', async chatRoomId => {
			logStart('Joining ChatRoom')

			const userList = await isUserInChatRoom(chatRoomId)
			console.log(userList)
			console.log(userList.includes(userData.user!))
			if (!userList.includes(chatRoomId)) {
				userData.chatRoomList.push(chatRoomId)
			}

			if (userList.length === 0 || !userList.includes(userData.user!)) {
				socket.join(chatRoomId)
				console.log(`1. ${userData.user} joining chatRoom`)
				console.log(`ChatRoom Id: ${chatRoomId}`)
				userList.push(userData.user!)
			}
			console.log(`Final userList is ${userList}`)
			io.to(chatRoomId).emit('connectStatus', {
				userId: userList,
				chatRoomId,
			})
			logEnd('Joining ChatRoom')
		})

		socket.on('seenMessageACK', async (msgId, myChatRoomId, chatRoomId) => {
			logStart('Socket API: SeenMessage')

			const session = await mongoose.startSession()
			// const originalMessage = await Message.findById(msgId);
			try {
				session.startTransaction()
				await Message.findByIdAndUpdate({ _id: msgId, __v: 0 }, { isSeen: true }, { session })
				await session.commitTransaction()

				socket.broadcast.to(chatRoomId).emit('seenMessageFIN', myChatRoomId)
			} catch (e) {
				await session.abortTransaction()
			} finally {
				session.endSession()
			}

			logEnd('Socket API: SeenMessage')
		})

		socket.on('sendMessage', async (msg, chatRoomId) => {
			logStart('Socket API : Send Message')
			// console.log('chat Room Id is ' + chatRoomId);

			const newMessage = new Message({
				senderId: userData.user,
				chatRoomId,
				message: msg,
				type: 'text',
				isSeen: false,
				createdAt: Date.now(),
			})
			const session = await mongoose.startSession() // start a new session for the transaction
			try {
				session.startTransaction() // Start the transaction
				Promise.all([
					await newMessage.save({ session }), // saving msg to the mongo db
					await UserChatRoom.findOneAndUpdate(
						{ receiver: userData.user, chatRoom: chatRoomId },
						{ $push: { unseenMessage: newMessage._id } },
						{ session },
					),
					await ChatRoom.findByIdAndUpdate(
						chatRoomId,
						{
							$push: { messages: newMessage._id },
							$set: { lastMessage: newMessage._id },
						},
						{ session },
					),
				])

				await session.commitTransaction() // Committing the transaction
				io.to(chatRoomId).emit('receiveMessage', newMessage)
				logEnd('Socket API : Send Message')
			} catch (error) {
				await session.abortTransaction()
				console.log(error)
			} finally {
				session.endSession()
			}
		})

		socket.on('broadcast_message', data => {
			socket.broadcast.emit('receive_message', data)
		})

		socket.on('disconnect', async () => {
			console.log('Client disconnected')
			console.log(userData.chatRoomList)
			userData.chatRoomList.forEach(chatRoomId => {
				console.log('disconnected')
				io.to(chatRoomId).emit('disconnectStatus', { userId: userData.user })
			})
			userData.chatRoomList = []
			userData.user = ''
			userData.token = ''

			const userId = Object.keys(userSocketIds).find(id => userSocketIds[id] === socket.id)
			if (userId) {
				delete userSocketIds[userId]
			}
		})
		// This function checks if a user is already in a chat room
	})

	return io
}

export default socketInit

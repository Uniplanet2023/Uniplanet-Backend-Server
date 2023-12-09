import express from 'express'
import mongoose from 'mongoose'
import auth from '../../middlewares/auth'
import { User } from '../../models/index'
import { ChatRoom, UserChatRoom } from '../../models/index'
import { getUserDataFunction } from '../../functions/user_data'
import { logStart, logEnd, handleError } from '../../functions/log_function'

const chatRouter = express.Router()

chatRouter.post('/api/createChatRoom', auth, async (req, res) => {
	try {
		logStart('Creating ChatRoom API')
		const session = await mongoose.startSession() // start a new session for the transaction
		session.startTransaction() // Start the transaction
		const { receiverId, productId } = req.body
		const user = await User.findOne({ _id: req.user })

		console.log('1. Cheking UserID and ReceiverID')
		if (!receiverId || req.user === receiverId || !user) {
			await session.abortTransaction()
			session.endSession()
			res.status(400).json('Something Wrong')
			return
		}

		// // Efficiently check if a chat room already exists
		let myChatRoom
		if (user.myChatRoom.length > 0) {
			myChatRoom = await UserChatRoom.findOne({
				receiver: receiverId,
				_id: { $in: user.myChatRoom },
			})
				.populate({
					path: 'receiver',
					select: 'name email _id school verified profileImage like selling sold bought type',
				})
				.populate({
					path: 'chatRoom',
					populate: {
						path: 'product',
						populate: {
							path: 'seller',
							select: 'name email _id school verified profileImage like selling sold bought type',
						},
					},
				})
			await session.commitTransaction()
			session.endSession()

			res.status(200).json(myChatRoom)
			return
		}

		if (!myChatRoom) {
			console.log('create new chat room')
			const newChatRoom = new ChatRoom({
				product: productId,
				chatRoomType: 'resell', // Assuming this is a direct message chat room.
			})

			myChatRoom = new UserChatRoom({
				receiver: receiverId,
				chatRoom: newChatRoom._id,
				type: 'buyer',
			})

			const receiverChatRoom = new UserChatRoom({
				receiver: req.user,
				chatRoom: newChatRoom._id,
				type: 'seller',
			})
			await Promise.all([
				// runing currently  (not sequential)
				await newChatRoom.save({ session }), // Create Chat room (model)
				await myChatRoom.save({ session }), // my Chatting (model)
				await receiverChatRoom.save({ session }), // target chatting room --> There is a issue
				await User.findByIdAndUpdate(
					req.user,
					{
						$addToSet: { myChatRoom: myChatRoom._id }, // User
					},
					{ session },
				),
				await User.findByIdAndUpdate(
					receiverId,
					{
						$addToSet: { myChatRoom: receiverChatRoom._id },
					},
					{ session },
				),
			])
		}
		await session.commitTransaction()
		session.endSession()
		myChatRoom = await UserChatRoom.findById(myChatRoom._id)
			.populate({
				path: 'receiver',
				select: 'name email _id school verified profileImage like selling sold bought type',
			})
			.populate({
				path: 'chatRoom',
				populate: {
					path: 'product',
					populate: {
						path: 'seller',
						select: 'name email _id school verified profileImage like selling sold bought type',
					},
				},
			})

		res.status(200).json(myChatRoom)

		logEnd('Creating ChatRoom API')
	} catch (e) {
		handleError(res, e as Error)
	}
})

chatRouter.get('/api/getChatRooms', auth, async (req, res) => {
	try {
		logStart('Getting ChatRoom API')
		console.log('1. Finding ChatRoom from DB')
		const populatedUser = await getUserDataFunction(req.user as string)
		if (!populatedUser) {
			throw Error()
		}
		res.status(200).json(populatedUser.myChatRoom)
		logEnd('Getting ChatRoom API')
	} catch (e) {
		handleError(res, e as Error)
	}
})

chatRouter.post('/api/getMessages', auth, async (req, res) => {
	try {
		logStart('Getting Message API')
		const { myChatRoomId, page } = req.body

		if (!myChatRoomId) {
			res.status(400).json({ error: 'ChatRoom ID is required' })
			return
		}

		if (page === undefined) {
			res.status(400).json({ error: 'Valid page number is required' })
			return
		}

		console.log('1. getting messages from database')
		const limit = 20
		const skip = page * limit

		const myChatRoom = await UserChatRoom.findById(myChatRoomId)
			.populate({
				path: 'chatRoom',
				select: 'messages',
				populate: {
					path: 'messages',
					options: { sort: { createdAt: -1 }, limit, skip },
				},
			})
			.lean()

		if (!myChatRoom || !myChatRoom.chatRoom || myChatRoom.chatRoom.messages.length === 0) {
			res.status(200).json({ messages: [] })
			return
		}

		const { messages } = myChatRoom.chatRoom
		res.status(200).json({ messages })
		logEnd('Getting Message API')
	} catch (e) {
		handleError(res, e as Error)
	}
})
export default chatRouter

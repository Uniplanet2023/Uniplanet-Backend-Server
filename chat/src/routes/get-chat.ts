import express from 'express'
import Chat from '../models/chat'
import { tokenValidation } from '@uniplanet-lib/common'
import { GET_CHAT_LIST } from './routes-def'
import GetChatInfo from '../event/serializer/get-chat'
import Message from '../models/message'
import UnseenMessage from '../models/unseen-message'
import User from '../models/user'

const getChatRouter = express.Router()
getChatRouter.get(GET_CHAT_LIST, tokenValidation, async (req, res) => {
	const { page } = req.query
	console.log( 'page:', page)
	const pageNumber = parseInt(page as string) || 1
	const limit = 10
	const skip = (pageNumber - 1) * limit

	const chatList = []
	let totalUnseenMessage = 0
	const chats = await Chat.find({
		$or: [{ seller: req.user!.id }, { buyer: req.user!.id }],
		deletionDate: null,
	})
		.populate('buyer seller lastMessage')
		.sort({ updatedAt: -1 })
		.limit(limit)
		.skip(skip)

	if (!chats || chats.length === 0) {
		return res.status(200).json([])
	}
	for (const chat of chats) {
		let unseenMessage = await UnseenMessage.findOne({
			user: req.user!.id,
			chat: chat._id,
		})
		if(!unseenMessage){
			await UnseenMessage.build({
				chat: chat._id,
				user: req.user!.id,
				unseenMessages: 0,
			}).save()
			chatList.push({ chat: new GetChatInfo(chat, 0).serializeRest() })
		}else{
			chatList.push({ chat: new GetChatInfo(chat, unseenMessage.unseenMessages).serializeRest() })
		}
	}
	const user = await User.findById(req.user!.id);
	if(user){
		totalUnseenMessage = user.totalUnseenMessages;
	}
	return res.status(200).json({ chatList: chatList, totalUnseenMessage: totalUnseenMessage }) // Changed status code to 200 for successful response
})
export default getChatRouter

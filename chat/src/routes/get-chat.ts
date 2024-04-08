import express from 'express'
import Chat from '../models/chat'
import { redisClient, tokenValidation } from '@uniplanet-lib/common'
import { GET_CHAT_LIST } from './routes-def'
import GetChatInfo from '../event/serializer/get-chat'
import { GetChatRestPayload } from '../event/serializer/type-def'
import Message from '../models/message'

const getChatRouter = express.Router()
getChatRouter.get(GET_CHAT_LIST, tokenValidation, async (req, res) => {
	const chatList = []
	var totalUnseenMessage = 0
	const chats = await Chat.find({
		$or: [{ seller: req.user!.id }, { buyer: req.user!.id }],
	})
		.populate('buyer seller lastMessage')
		.sort({ updatedAt: -1 })

	if (!chats || chats.length === 0) {
		return res.status(200).json([])
	}
	for (const chat of chats) {
		const unseenMessage = await Message.find({ chat: chat._id, receiver: req.user!.id, readDate: null })
		totalUnseenMessage += unseenMessage.length
		chatList.push({ chat: new GetChatInfo(chat,unseenMessage.length).serializeRest() })
	}

	return res.status(200).json({'chatList':chatList,'totalUnseenMessage':totalUnseenMessage}) // Changed status code to 200 for successful response
})
export default getChatRouter

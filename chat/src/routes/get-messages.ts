import express from 'express'
import Chat from '../models/chat'
import { tokenValidation } from '@uniplanet-lib/common'
import { GET_MESSAGES } from './routes-def'
import { GetMessageRestPayload } from '../event/serializer/type-def'
import Message from '../models/message'
import GetMessageInfo from '../event/serializer/get-message'

const getMessagesRouter = express.Router()
getMessagesRouter.get(GET_MESSAGES, tokenValidation, async (req, res) => {
	const { chatId, page } = req.query
	const chat = await Chat.findById(chatId)
	if (!chat) {
		return res.status(404).send('Chat not found')
	}
	if (!chat.buyer._id.equals(req.user!.id) && !chat.seller._id.equals(req.user!.id)) {
		return res.status(401).send('Unauthorized')
	}

	
	const pageNumber = parseInt(page as string) || 1
	const limit = 20
	const skip = (pageNumber - 1) * limit

	const messages = await Message.find({ chat: chatId, deletionDate: null })
		.sort({ createdAt: -1 })
		.limit(limit)
		.skip(skip)
	if (!messages) {
		return res.status(404).send('No messages found')
	}

	const messageList: string[] = []
	messages.forEach(async message => {
		const messageInfo: GetMessageRestPayload = new GetMessageInfo(message).serializeRest()
		messageList.push(JSON.stringify(messageInfo))
	})

	return res.status(201).json(messageList)
})
export default getMessagesRouter

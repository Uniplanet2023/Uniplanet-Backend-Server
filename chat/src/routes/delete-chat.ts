import express from 'express'
import Chat from '../models/chat'
import { redisClient, tokenValidation } from '@uniplanet-lib/common'
import { DELETE_CHAT_ROUTE } from './routes-def'

import Message from '../models/message'
import User from '../models/user'
import {markChatMessagesAndSendNotification} from '../function/mark-chat-messages'
import { cloudinaryAPI } from '../app'

const deleteChatRouter = express.Router()

deleteChatRouter.delete(DELETE_CHAT_ROUTE, tokenValidation, async (req, res) => {
	const { chatId } = req.params

	if (!chatId) {
		return res.status(400).json({ error: 'Missing required fields' })
	}
	try {
		await cloudinaryAPI.api.delete_resources_by_prefix('chat-images/' + chatId + '/')
		await cloudinaryAPI.api.delete_folder('chat-images/' + chatId)
	} catch (err) {
		console.log(err)
		console.log('Possibliy no images to delete or no folder to delete')
	}
	// Delete all the images from cloudinary

	const chatRoom = await Chat.findById(chatId).populate('buyer', 'seller')
	if (chatRoom === null) {
		return res.status(404).send({ message: 'Chat not found' })
	}
	chatRoom.deletionDate = new Date()
	await Message.updateMany({ chat: chatId }, { deletionDate: new Date() })
	await chatRoom.save()

	markChatMessagesAndSendNotification({ chatId: chatRoom._id, userId: chatRoom.seller.id })
	markChatMessagesAndSendNotification({ chatId: chatRoom._id, userId: chatRoom.buyer.id })

	return res.status(200).send({ message: 'Chat deleted successfully' })
})

export default deleteChatRouter

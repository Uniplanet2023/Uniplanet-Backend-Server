import express from 'express'
import Chat from '../models/chat'
import { tokenValidation } from '@uniplanet-lib/common'
import { DELETE_CHAT_ROUTE } from './routes-def'
import Message from '../models/message'
import { markChatMessagesAndSendNotification } from '../function/mark-chat-messages'

const deleteChatRouter = express.Router()

deleteChatRouter.delete(DELETE_CHAT_ROUTE, tokenValidation, async (req, res) => {
	const { chatId } = req.params

	if (!chatId) {
		return res.status(400).json({ error: 'Missing required fields' })
	}

	const chatRoom = await Chat.findById(chatId).populate('buyer', 'seller')
	if (chatRoom === null) {
		return res.status(404).send({ message: 'Chat not found' })
	}
	if(chatRoom.deletedFrom){
		chatRoom.perminentDelete = true;
		chatRoom.deletionDate = new Date();
		await Message.updateMany({ chat: chatId }, { deletionDate: new Date() });
	}else{
		chatRoom.deletedFrom = req.user!.id;	
	}

	await chatRoom.save()
	markChatMessagesAndSendNotification({ chatId: chatRoom._id, userId: chatRoom.seller.id })
	markChatMessagesAndSendNotification({ chatId: chatRoom._id, userId: chatRoom.buyer.id })

	return res.status(200).send({ message: 'Chat deleted successfully' })
})

export default deleteChatRouter

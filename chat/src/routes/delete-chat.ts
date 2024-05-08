import express from 'express'
import Chat from '../models/chat'
import { tokenValidation } from '@uniplanet-lib/common'
import { DELETE_CHAT_ROUTE } from './routes-def'
import { cloudinaryAPI } from '..'
import Message from '../models/message'
import User from '../models/user'
import UnseenMessage from '../models/unseen-message'

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

	const chatRoom = await Chat.findById(chatId)
	if (chatRoom === null) {
		return res.status(404).send({ message: 'Chat not found' })
	}
	chatRoom.deletionDate = new Date()
	await Message.updateMany({ chat: chatId }, { deletionDate: new Date() })
	await chatRoom.save()
	let user = await User.findById(req.user!.id);
	if(user == null) {
		throw new Error('User not found');
	}
	const unseenMessages = await UnseenMessage.findOne({ chat: chatId, user: req.user!.id });
	user.totalUnseenMessages -= unseenMessages?.unseenMessages as number;
	await unseenMessages?.updateOne({deletionDate: new Date()});
	if(user.totalUnseenMessages < 0) {
		user.totalUnseenMessages = 0;
	}
	await user.save();
	return res.status(200).send({ message: 'Chat deleted successfully' })
})

export default deleteChatRouter

import express from 'express'
import Chat from '../models/chat'
import { redisClient, tokenValidation } from '@uniplanet-lib/common'
import { GET_CHAT_LIST } from './routes-def'
import GetChatInfo from '../event/serializer/get-chat'
import Message from '../models/message'
import User from '../models/user'

const getChatRouter = express.Router()
getChatRouter.get(GET_CHAT_LIST, tokenValidation, async (req, res) => {
	const { page } = req.query
	console.log('page:', page)
	const pageNumber = parseInt(page as string) || 1
	const limit = 10
	const skip = (pageNumber - 1) * limit

	const chatList = []
	let totalUnseenMessage = await redisClient.redis.zCount(`user:${req.user!.id}:unseen`, '-inf', '+inf');
	
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
		const unseenMessages = await redisClient.redis.zRange(`user:${req.user!.id}:unseen`, 0, -1)

		// Count unseen messages for the specific chat
        const numberOfUnseenMessages = unseenMessages.reduce((count, msg) => {
            const message = JSON.parse(msg);
            if (message.chat == chat._id.toString()) {
                count++;
            }
            return count;
        }, 0);
		chatList.push({ chat: new GetChatInfo(chat, numberOfUnseenMessages).serializeRest() })
	}

	return res.status(200).json({ chatList: chatList, totalUnseenMessage: totalUnseenMessage }) // Changed status code to 200 for successful response
})
export default getChatRouter

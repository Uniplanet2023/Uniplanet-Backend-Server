import express from 'express'
import Chat from '../models/chat'
import { redisClient, tokenValidation } from '@uniplanet-lib/common'
import { CREATE_CHAT } from './routes-def'
import GetChatInfo from '../event/serializer/get-chat'
import User from '../models/user'
import { createChatProducer } from '..'
import Message from '../models/message'

const createChatRouter = express.Router()

createChatRouter.post(CREATE_CHAT, tokenValidation, async (req, res) => {
	const { productId, productName, seller, buyer } = req.body

	const sellerParsed = JSON.parse(seller)
	const buyerParsed = JSON.parse(buyer)
	var sellerObj = await User.findById(sellerParsed.id)
	var buyerObj = await User.findById(buyerParsed.id)
	if (!sellerObj) {
		sellerObj = User.build(sellerParsed)
		sellerObj.save()
	}
	if (!buyerObj) {
		buyerObj = User.build(buyerParsed)
		buyerObj.save()
	}

	// Check if a chat already exists between these two users for this product
	const existingChat = await Chat.findOne({
		productId,
		buyer: buyerObj,
		seller: sellerObj,
	})
		.populate('buyer')
		.populate('seller')

	console.log('existing chat:', existingChat)

	if (existingChat) {
		const unseenMessage = await Message.find({ chat: existingChat._id, receiver: req.user!.id, readDate: null })
		const chatInfo = new GetChatInfo(existingChat, unseenMessage.length);
		return res.status(chatInfo.getStatusCode()).json({ chat: chatInfo.serializeRest() })
	}

	// Create and save the chat
	const chat = Chat.build({
		productName,
		productId,
		buyer: buyerObj.id,
		seller: sellerObj.id,
	})
	// Save the online status of the buyer in Redis

	const chatObj = await (await chat.save())
    .populate('seller buyer');
    createChatProducer.sendMessage({
        productId: productId,
    });
	const chatInfo = new GetChatInfo(chatObj,0)

	// Include serialized buyer and seller data in the response
	return res.status(chatInfo.getStatusCode()).json({ chat: chatInfo.serializeRest() })
})

export default createChatRouter

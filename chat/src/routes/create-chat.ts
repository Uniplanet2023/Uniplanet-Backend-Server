import express from 'express'
import Chat from '../models/chat'
import { redisClient, tokenValidation } from '@uniplanet-lib/common'
import { CREATE_CHAT } from './routes-def'
import GetChatInfo from '../event/serializer/get-chat'
import User from '../models/user'

const createChatRouter = express.Router()

createChatRouter.post(CREATE_CHAT, tokenValidation, async (req, res) => {
	const { productId, seller, buyer } = req.body

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
		productId: productId,
		buyer: buyerObj,
		seller: sellerObj,
	})
		.populate('buyer')
		.populate('seller')

	console.log('existing chat:', existingChat)

	if (existingChat) {
		const chatInfo = new GetChatInfo(existingChat)
		return res.status(chatInfo.getStatusCode()).json({ chat: chatInfo.serializeRest() })
	}

	// Create and save the chat
	const chat = Chat.build({
		productId: productId,
		buyer: buyerObj.id,
		seller: sellerObj.id,
	})
	// Save the online status of the buyer in Redis

	const chatObj = await (await chat.save())
    .populate('seller buyer');
	const chatInfo = new GetChatInfo(chatObj)

	// Include serialized buyer and seller data in the response
	return res.status(chatInfo.getStatusCode()).json({ chat: chatInfo.serializeRest() })
})

export default createChatRouter

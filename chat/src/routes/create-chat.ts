import express from 'express'
import Chat from '../models/chat'
import { tokenValidation } from '@uniplanet-lib/common'
import { CREATE_CHAT } from './routes-def'
import GetChatInfo from '../event/serializer/get-chat'
import User from '../models/user'
import Message from '../models/message'
import { createChatProducer } from '../app'

const createChatRouter = express.Router()

createChatRouter.post(CREATE_CHAT, tokenValidation, async (req, res) => {
	const { productId, productName, productType, seller, buyer, type } = req.body

	const sellerParsed = JSON.parse(seller)
	const buyerParsed = JSON.parse(buyer)
	let sellerObj = await User.findById(sellerParsed.id)
	let buyerObj = await User.findById(buyerParsed.id)
	if (!sellerObj) {
		sellerObj = User.build(sellerParsed)
		await sellerObj.save()
	}
	if (!buyerObj) {
		buyerObj = User.build(buyerParsed)
		await buyerObj.save()
	}
	if(productType == 'free' && req.user!.id === buyerObj.id && buyerObj.numberOfFreeItemClick < 1){
		return res.status(400).json({ msg: 'Please Subscribe UniPlanet Platform to get Free Items' })
	}else if (productType == 'free' && req.user!.id === sellerObj.id && sellerObj.numberOfFreeItemClick < 1){
		return res.status(400).json({ msg: 'Please Subscribe UniPlanet Platform to get Free Items' })
	}else if (productType == 'free' && req.user!.id === buyerObj.id && buyerObj.numberOfFreeItemClick > 0){
			buyerObj.numberOfFreeItemClick -= 1
			await buyerObj.save()
	}else if (productType == 'free' && req.user!.id === sellerObj.id && sellerObj.numberOfFreeItemClick > 0){
			sellerObj.numberOfFreeItemClick -= 1
			await sellerObj.save()
	}
	// Check if a chat already exists between these two users for this product
	const existingChat = await Chat.findOne({
		productId,
		buyer: buyerObj,
		seller: sellerObj,
	})
		.populate('buyer')
		.populate('seller')
		.populate('lastMessage')

	if (existingChat) {
		let msg = 'existing chat'
		if (existingChat.deletionDate !== null) {
			msg = 'chat restored'
			await existingChat.updateOne({ deletionDate: null, deletedFrom: null, perminentDelete: false })
			await Message.updateMany({ chat: existingChat.id }, { deletionDate: null })
			existingChat.deletionDate = undefined
			existingChat.deletedFrom = undefined
			existingChat.perminentDelete = false
		}
		const unseenMessage = await Message.find({ chat: existingChat._id, receiver: req.user!.id, readDate: null })
		const chatInfo = new GetChatInfo(existingChat, unseenMessage.length)
		return res.status(chatInfo.getStatusCode()).json({ chat: chatInfo.serializeRest(), msg })
	}
	
	// Create and save the chat
	const chat = Chat.build({
		productName,
		productId,
		buyer: buyerObj.id,
		seller: sellerObj.id,
		type,
	})
	// Save the online status of the buyer in Redis

	const chatObj = await (await chat.save()).populate('seller buyer')
	createChatProducer.sendMessage({
		productId: productId,
		type: type,
	})
	const chatInfo = new GetChatInfo(chatObj, 0)

	// Include serialized buyer and seller data in the response
	return res.status(chatInfo.getStatusCode()).json({ chat: chatInfo.serializeRest(), msg: 'new chat' })
})

export default createChatRouter

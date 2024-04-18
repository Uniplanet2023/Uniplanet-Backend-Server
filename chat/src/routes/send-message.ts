import express from 'express'
import { tokenValidation } from '@uniplanet-lib/common'
import { SEND_MESSAGE } from './routes-def'
import Message from '../models/message'

const sendMessagesRouter = express.Router()
sendMessagesRouter.post(SEND_MESSAGE, tokenValidation, async (req, res) => {
	const { message, messageType, receiver, chat, createdAt } = req.body
	console.log('received chatId:', chat)
	const msg = await Message.build({
		sender: req.user!.id,
		chat,
		message,
		messageType,
		receiver,
		createdAt,
	}).save()

	return res.status(201).send(msg)
})
export default sendMessagesRouter

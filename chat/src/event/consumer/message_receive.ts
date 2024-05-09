import { Topics, BaseConsumer, MessageCreatedEvent, redisClient } from '@uniplanet-lib/common'
import Message from '../../models/message'
import Chat from '../../models/chat'
import User from '../../models/user'
import { addUnSeenMessage } from '../../function/add-unseen-message'
import admin from 'firebase-admin'
import { newMessageNotification } from '../../notification/format/new-message'
import { sendingMessageNotification } from '../../notification/notification-api/sending-message'
// Extend the BaseConsumer for the user:created event
export class MessageCreatedConsumer extends BaseConsumer<MessageCreatedEvent> {
	topic: Topics.MessageCreated = Topics.MessageCreated

	// Implement the onMessage method
	async onMessage(data: MessageCreatedEvent['data']): Promise<void> {
		try {
			console.log('Message Received')

			const receiver = await User.findById(data.receiver)
			const sender = await User.findById(data.sender)
			const chat = await Chat.findById(data.chat)
			if (!sender || !receiver) {
				throw new Error('User not found')
			}
			if (!chat) {
				throw new Error('Chat not found')
			}
			const msgModel = Message.build({
				sender: sender._id,
				receiver: receiver._id,
				message: data.message,
				messageType: data.messageType,
				chat: chat._id,
				createdAt: data.createdAt,
			})
			const message = await msgModel.save()
			await chat.updateOne({ lastMessage: message._id })
			// Add UnSeen message to the receiver
			await addUnSeenMessage({ userId: receiver._id,message })
			// Send notification to the receiver
			await sendingMessageNotification({ sender, receiver, message})
			
		} catch (err) {
			console.log(err)
		}
	}
}

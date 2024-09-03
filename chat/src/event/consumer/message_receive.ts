import { Topics, BaseConsumer, MessageCreatedEvent, redisClient } from '@uniplanet-lib/common'
import Message from '../../models/message'
import Chat from '../../models/chat'
import { addUnSeenMessage } from '../../function/add-unseen-message'
import { sendingMessageNotification } from '../../notification/notification-api/sending-message-notification'
import { sendNewMessageEmail } from '../../notification/notification-api/sending-message-email'
import { BuildMessageEmailTextArgs } from '../../notification/format/signup-email-format'
// Extend the BaseConsumer for the user:created event
export class MessageCreatedConsumer extends BaseConsumer<MessageCreatedEvent> {
	topic: Topics.MessageCreated = Topics.MessageCreated

	// Implement the onMessage method
	async onMessage(data: MessageCreatedEvent['data']): Promise<void> {
		try {
			

			const chat = await Chat.findById(data.chat).populate('buyer seller lastMessage')

			if (!chat) {
				throw new Error('Chat not found')
			}
			const sender = chat.buyer.id == data.sender ? chat.buyer : chat.seller
			const receiver = chat.buyer.id == data.sender ? chat.seller : chat.buyer

			const msgModel = Message.build({
				sender: data.sender,
				receiver: data.receiver,
				message: data.message,
				messageType: data.messageType,
				chat: chat._id,
				createdAt: data.createdAt,
			})
			const message = await msgModel.save()
			await chat.updateOne({ lastMessage: message._id })
			// Add UnSeen message to the receiver
			await addUnSeenMessage({ userId: data.receiver, message })
			// Send notification to the receiver
			await sendingMessageNotification({ sender, receiver, message, chat })
			// Send Email to the receiver
			const receiverIsOnline = await redisClient.redis.sIsMember('Online User', receiver.id);
			receiverIsOnline ? null:
			await sendNewMessageEmail(
				{
					email: receiver.email,
					senderName: sender.name,
					receiverName: receiver.name,
				} as BuildMessageEmailTextArgs,
			)
		} catch (err) {
			console.log(err)
		}
	}
}

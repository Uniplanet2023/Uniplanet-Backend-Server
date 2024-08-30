import { Topics, BaseConsumer, MessageCreatedEvent } from '@uniplanet-lib/common'
import Message from '../../models/message'
import Chat from '../../models/chat'
import { addUnSeenMessage } from '../../function/add-unseen-message'
import { sendingMessageNotification } from '../../notification/notification-api/sending-message'
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
		} catch (err) {
			console.log(err)
		}
	}
}

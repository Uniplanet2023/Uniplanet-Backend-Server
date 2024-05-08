import { Topics, BaseConsumer, MessageReadAllEvent } from '@uniplanet-lib/common'

import Message from '../../models/message'
import { userUpdateProvider } from '../..'
import Chat from '../../models/chat'

// Extend the BaseConsumer for the user:created event
export default class MessageReadAllConsumer extends BaseConsumer<MessageReadAllEvent> {
	topic: Topics.MessageReadAll = Topics.MessageReadAll

	// Implement the onMessage method
	async onMessage(data: MessageReadAllEvent['data']): Promise<void> {
		try {
			console.log('Message Read All Kafka')
			console.log(data)
			await Message.find({ chat: data.chat, receiver: data.sender, readDate: null })
				.sort({ createdAt: -1 })
				.limit(20)
				.updateMany({ readDate: data.readDate })
			const chat = await Chat.findById(data.chat).populate('seller buyer');
			if (chat == null) {
				throw new Error('Chat not found');
			}
			userUpdateProvider.sendMessage({
				id: chat.seller.id == data.sender ? chat.buyer.id: chat.seller.id,
				unSeenMessages: -chat.unseenMessage
			})
			chat.unseenMessage = 0;
			await chat.save();
		} catch (err) {
			console.log(err)
		}
	}
}

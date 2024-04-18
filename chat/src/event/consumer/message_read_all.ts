import { Topics, BaseConsumer, MessageReadAllEvent } from '@uniplanet-lib/common'

import Message from '../../models/message'

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
		} catch (err) {
			console.log(err)
		}
	}
}

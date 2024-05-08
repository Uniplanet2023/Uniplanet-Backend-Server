import { Topics, BaseConsumer, MessageReadAllEvent } from '@uniplanet-lib/common'

import Message from '../../models/message'
import { userUpdateProvider } from '../..'
import Chat from '../../models/chat'
import UnseenMessage from '../../models/unseen-message'

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
			const unseenMessage = await UnseenMessage.findOne({ chat: chat._id, user: data.sender });
			if (unseenMessage == null) {
				await UnseenMessage.build({
					chat: chat._id,
					user: data.sender,
					unseenMessages: 0
				}).save();
			}else{
				userUpdateProvider.sendMessage({
					id: chat.seller.id == data.sender ? chat.buyer.id: chat.seller.id,
					unSeenMessages: -(unseenMessage.unseenMessages as number)
				})
				unseenMessage.unseenMessages = 0;
				await unseenMessage.save();
			}
		} catch (err) {
			console.log(err)
		}
	}
}

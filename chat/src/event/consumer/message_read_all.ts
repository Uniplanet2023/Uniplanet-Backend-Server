import { Topics, BaseConsumer, MessageReadAllEvent } from '@uniplanet-lib/common'

import Message from '../../models/message'
import { userUpdateProvider } from '../..'
import Chat from '../../models/chat'
import UnseenMessage from '../../models/unseen-message'
import User from '../../models/user'

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
					id: data.sender,
					unSeenMessages: -(unseenMessage.unseenMessages as number)
				})
				unseenMessage.unseenMessages = 0;
				await unseenMessage.save();
				let user = await User.findById(data.sender);
				if(user == null) {
					throw new Error('User not found');
				}
				user.totalUnseenMessages -= unseenMessage.unseenMessages as number;
				if(user.totalUnseenMessages < 0) {
					user.totalUnseenMessages = 0;
				}
				await user.save();
			}
		} catch (err) {
			console.log(err)
		}
	}
}

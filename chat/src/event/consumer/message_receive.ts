import { Topics, BaseConsumer, MessageCreatedEvent } from '@uniplanet-lib/common'
import Message from '../../models/message'
import Chat from '../../models/chat'
import User from '../../models/user'
import UnseenMessage from '../../models/unseen-message'

// Extend the BaseConsumer for the user:created event
export default class MessageCreatedConsumer extends BaseConsumer<MessageCreatedEvent> {
	topic: Topics.MessageCreated = Topics.MessageCreated

	// Implement the onMessage method
	async onMessage(data: MessageCreatedEvent['data']): Promise<void> {
		try {
			console.log('Message Received')
			console.log(data)
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
			const msg = await msgModel.save()
			chat.lastMessage = msg._id
			await chat.save();
			const unseenMessage =await UnseenMessage.findOne(
				{ user: receiver._id, chat: chat._id },
			)
			if(unseenMessage){
				unseenMessage.unseenMessages += 1
				await unseenMessage.save()
				receiver.totalUnseenMessages += unseenMessage.unseenMessages as number;
				await receiver.save();
			}else{
				await UnseenMessage.build({
					chat: chat._id,
					user: receiver._id,
					unseenMessages: 1,
				}).save()
			}
			

		} catch (err) {
			console.log(err)
		}
	}
}

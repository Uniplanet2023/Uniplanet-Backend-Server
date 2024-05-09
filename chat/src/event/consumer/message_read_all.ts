import { Topics, BaseConsumer, MessageReadAllEvent, redisClient } from '@uniplanet-lib/common'

import Message from '../../models/message'
import Chat from '../../models/chat'
import User from '../../models/user'
import markChatMessagesAndSendNotification from '../../function/mark-chat-messages'
import { userUpdateProvider } from '../../config'
import getUnseenMessageCount from '../../function/get-unseen-message'
import { readNotification } from '../../notification/format/read-message'
import { readMessageNotification } from '../../notification/notification-api/read-message'

// Extend the BaseConsumer for the user:created event
export class MessageReadAllConsumer extends BaseConsumer<MessageReadAllEvent> {
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
			const chat = await Chat.findById(data.chat).populate('seller buyer')
			if (chat == null) {
				throw new Error('Chat not found')
			}

			
			// Fetch all unseen messages for the user
			const seenMessages = await markChatMessagesAndSendNotification({ chatId: chat._id, userId: data.sender })

			// Change user unSeenMessages in account
			userUpdateProvider.sendMessage({
				id: data.sender,
				unSeenMessages: -(seenMessages.length as number),
			})
			
		} catch (err) {
			console.log(err)
		}
	}
}

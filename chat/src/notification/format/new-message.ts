import GetChatInfo from '../../event/serializer/get-chat'
import getUnseenMessageCount from '../../function/get-unseen-message'
import { getUnseenMessages } from '../../function/mark-chat-messages'
import { ChatDocument } from '../../models/chat'
import { MessageDocument } from '../../models/message'
import { UserDocument } from '../../models/user'

export const newMessageNotification = async (receiverToken: string, message: MessageDocument, sender: UserDocument, chat: ChatDocument) => {
	const unseenMessageCount = (await getUnseenMessageCount(message.receiver._id.toString()))
	const currentChatUnseenMessage = await getUnseenMessages({ userId: message.receiver._id.toString(), chatId: message.chat.toString() });
	
	const chatData = new GetChatInfo( chat, currentChatUnseenMessage.length).serializeRest();
	chatData.unseenMessageCount = chatData.unseenMessageCount as string;
	console.log('chatData', JSON.stringify(chatData));
	
	const notificationPayload = {
		notification: {
			title: sender.name as string,
			body: message.messageType == 'image' ? 'Image' : message.message,
		},
		data: {
			content: `{
				"id":-1,
				"badge":${unseenMessageCount},
				"channelKey":"chats",
				"displayOnForeground":false,
				"notificationLayout":"MessagingGroup",
				"largeIcon":"${sender.profileImage}",
				"bigPicture":"${sender.profileImage}",
				"showWhen":true,
				"autoDismissible":true,
				"privacy":"Private",
				"payload": ${JSON.stringify(chatData)}
			}`,
			payload: JSON.stringify(chatData)
		},

		android: {
			priority: 'high' as 'high' | 'normal', // or 'normal', or omit this property
		},
		apns: {
			headers: {
				'apns-priority': '5',
			},
			payload: {
				aps: {
					'mutable-content': 1,
					"badge": unseenMessageCount,
				},
			},
		},
		token: receiverToken,
	}
	return notificationPayload
}

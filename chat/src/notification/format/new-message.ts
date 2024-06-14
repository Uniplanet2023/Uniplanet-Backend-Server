import { channel } from 'diagnostics_channel'
import GetChatInfo from '../../event/serializer/get-chat'
import getUnseenMessageCount from '../../function/get-unseen-message'
import { getUnseenMessages } from '../../function/mark-chat-messages'
import { ChatDocument } from '../../models/chat'
import { MessageDocument } from '../../models/message'
import { UserDocument } from '../../models/user'

export const newMessageNotification = async (
	receiverToken: string,
	message: MessageDocument,
	sender: UserDocument,
	chat: ChatDocument,
) => {
	const unseenMessageCount = await getUnseenMessageCount(message.receiver._id.toString())
	const currentChatUnseenMessage = await getUnseenMessages({
		userId: message.receiver._id.toString(),
		chatId: message.chat.toString(),
	})

	const chatData = new GetChatInfo(chat, currentChatUnseenMessage.length).serializeRest()

	const notificationPayload = {
		notification: {
			title: sender.name as string,
			body: message.messageType == 'image' ? 'Image' : message.message,
		},
		data: {
			"content.id": "-1",
			"content.badge": `${unseenMessageCount}`,
			"content.channelKey": "chats",
			"content.displayOnForeground": "false",
			"content.notificationLayout": "MessagingGroup",
			"content.largeIcon": `${sender.profileImage}`,
			"content.bigPicture": `${sender.profileImage}`,
			"content.showWhen": "true",
			"content.autoDismissible": "true",
			"content.privacy": "Private",
			"content.payload": JSON.stringify(chatData),
			"Android.content.payload.android": JSON.stringify(chatData),
			"iOS.content.payload.ios": JSON.stringify(chatData)
		},

		android: {
			priority: 'high' as 'high' | 'normal', // or 'normal', or omit this property
		},
		apns: {
			payload: {
				aps: {
					'mutable-content': 1,
					"badge": unseenMessageCount,
				},
			},
			headers: {
				'apns-priority': "5"
			},
		},
		token: receiverToken,
	}
	return notificationPayload
}

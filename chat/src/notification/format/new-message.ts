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
			"content.id": "1",
			"content.badge": "42",
			"content.channelKey": "chats",
			"content.displayOnForeground": "true",
			"content.notificationLayout": "BigPicture",
			"content.largeIcon": "https://br.web.img3.acsta.net/pictures/19/06/18/17/09/0834720.jpg",
			"content.bigPicture": "https://www.dw.com/image/49519617_303.jpg",
			"content.showWhen": "true",
			"content.autoDismissible": "true",
			"content.privacy": "Private",
			// content: `{
			// 	"id":-1,
			// 	"badge":${unseenMessageCount},
			// 	"channelKey":"chats",
			// 	"displayOnForeground":false,
			// 	"notificationLayout":"MessagingGroup",
			// 	"largeIcon":"${sender.profileImage}",
			// 	"bigPicture":"${sender.profileImage}",
			// 	"showWhen":true,
			// 	"autoDismissible":true,
			// 	"privacy":"Private",
			// 	"payload": ${JSON.stringify(chatData)}
			// }`,
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
				"channelKey": 'chats',
			},
			headers: {
				'apns-priority': "5"
			},
		},
		token: receiverToken,
	}
	return notificationPayload
}

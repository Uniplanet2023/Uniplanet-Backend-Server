import getUnseenMessageCount from '../../function/get-unseen-message'
import { MessageDocument } from '../../models/message'
import { UserDocument } from '../../models/user'

export const newMessageNotification = async (receiverToken: string, message: MessageDocument, sender: UserDocument) => {
	const unseenMessageCount = (await getUnseenMessageCount(message.receiver._id.toString())) + 1
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
				"payload":{
					"message":${message},
				}
			}`,
		},

		android: {
			notification: {
				sound: 'default',
				tag: 'new message',
				click_action: 'FLUTTER_NOTIFICATION_CLICK',
			},
		},
		apns: {
			headers: {
				'apns-priority': '5',
			},
			payload: {
				aps: {
					'mutable-content': 1,
					badge: unseenMessageCount,
				},
			},
		},
		token: receiverToken,
	}
	return notificationPayload
}

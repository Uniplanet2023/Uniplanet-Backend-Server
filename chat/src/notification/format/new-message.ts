import getUnseenMessageCount from '../../function/get-unseen-message'
import { MessageDocument } from '../../models/message'
import { UserDocument } from '../../models/user'

export const newMessageNotification = async (receiverToken: string, message: MessageDocument, sender: UserDocument) => {
	const unseenMessageCount = (await getUnseenMessageCount(message.receiver._id.toString()))
	console.log(sender.profileImage);
	const notificationPayload = {
		notification: {
			title: sender.name as string,
			body: message.messageType == 'image' ? 'Image' : message.message,
		},
		data: {
			id:"-1",
			badge:unseenMessageCount.toString(),
			channelKey:"chats",
			displayOnForeground:"false",
			notificationLayout:"MessagingGroup",
			largeIcon:`${sender.profileImage}`,
			bigPicture:`${sender.profileImage}`,
			showWhen:"true",
			autoDismissible:"true",
			privacy:"Private",
			payload:{
				message:JSON.stringify(message),
			}
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

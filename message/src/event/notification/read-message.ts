import getUnseenMessageCount from "../../functions/get-unseen-message";

export const newMessageNotification = async (
	receiverToken: string,
	message: any,
	messageJson: string,
	senderJson: string,
) => {
	const sender = JSON.parse(senderJson)
	const unseenMessageCount = await getUnseenMessageCount(message.receiver) + 1;
	const notificationPayload = {
		notification: {
			title: sender.name as string,
			body: message.messageType == 'image'?'Image' :message.message,
		},
		data: {
			content:
			`{
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
					"message":${messageJson},
				}
			}`,
            actionButtons: `[
				{
					"key":"REDIRECT",
					"label":"Redirect",
					"autoDismissible":true
				},
				{
					"key":"CANCEL",
					"label":"Dismiss",
					"actionType":"DismissAction",
					"isDangerousOption":true,
					"autoDismissible":true
				}
			]`
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
				// 'apns-push-type': 'background',
				// 'apns-topic': 'shop.uniplanet.uniplanet',
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

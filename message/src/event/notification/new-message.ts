import { title } from "process"

// Configuration Constants
const LARGE_ICON_URL = "https://br.web.img3.acsta.net/pictures/19/06/18/17/09/0834720.jpg";
const BIG_PICTURE_URL = "https://www.dw.com/image/49519617_303.jpg";

export const newMessageNotification = (
	receiverToken: string,
	message: any,
	messageJson: string,
	senderJson: string,
) => {
	const sender = JSON.parse(senderJson)
	
	const notificationPayload = {
		notification: {
			title: sender.name as string,
			body: message.messageType == 'image'?'Image' :message.message,
		},
		data: {
			content:
			`{
				"id":-1,
				"badge":1,
				"channelKey":"alerts",
				"displayOnForeground":false,
				"notificationLayout":"BigPicture",
				"largeIcon":"${sender.profilePic}",
				"bigPicture":"${sender.profilePic}",
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
					"badge": 15,
				},  
			},
			},
		token: receiverToken,
	}
	return notificationPayload
}

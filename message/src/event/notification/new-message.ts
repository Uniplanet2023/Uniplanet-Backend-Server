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
	console.log(sender)
	console.log(messageJson);
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
				"channelKey":"chats",
				"displayOnForeground":false,
				"notificationLayout":"MessagingGroup",
				"largeIcon":"https://res.cloudinary.com/dtgmmfv3d/image/upload/f_auto,q_auto,c_fill,w_300,h_300/v1698359487/defaultImage/uj24px95hnrhydxobjl1.jpg",
				"bigPicture":"https://res.cloudinary.com/dtgmmfv3d/image/upload/f_auto,q_auto,c_fill,w_300,h_300/v1698359487/defaultImage/uj24px95hnrhydxobjl1.jpg",
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

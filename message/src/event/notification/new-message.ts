import { title } from "process"

export const newMessageNotification = (
	receiverToken: string,
	message: any,
	messageJson: string,
	senderJson: string,
) => {
	const sender = JSON.parse(senderJson)

	const notificationPayload = {
		// notification: {
		// 	title: sender.name as string,
		// 	body: message.message,
		// },
		data: {
			message: messageJson,
			sender: senderJson,
			type: 'new message',
			content:{
				id: "1",
				badge:'15',
				channelKey: "alert",
				notificationLayout: "BigPicture",
				largeIcon:"https://br.web.img3.acsta.net/pictures/19/06/18/17/09/0834720.jpg",
				bigPicture: "https://www.dw.com/image/49519617_303.jpg",
				showWhen: true,
				autoDismissible:true,
				payload:{
					secret:"Awesome Notifications Rocks!"
				}
			},
			iOS:{
				content:{
					title: sender.name as string,
					payload:{
						ios: "payload"
					}
				}
			}
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

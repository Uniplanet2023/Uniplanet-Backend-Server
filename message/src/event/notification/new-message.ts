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
			"content.id": "1",
			"content.badge": "42",
			"content.channelKey": "alerts",
			"content.displayOnForeground": "true",
			"content.notificationLayout": "BigPicture",
			"content.largeIcon": "https://br.web.img3.acsta.net/pictures/19/06/18/17/09/0834720.jpg",
			"content.bigPicture": "https://www.dw.com/image/49519617_303.jpg",
			"content.showWhen": "true",
			"content.autoDismissible": "true",
			"content.privacy": "Private",
			"content.payload.secret": "Awesome Notifications Rocks!",
			"actionButtons.0.key": "REDIRECT",
			"actionButtons.0.label": "Redirect",
			"actionButtons.0.autoDismissible": "true",
			"actionButtons.1.key": "DISMISS",
			"actionButtons.1.label": "Dismiss",
			"actionButtons.1.actionType": "DismissAction",
			"actionButtons.1.isDangerousOption": "true",
			"actionButtons.1.autoDismissible": "true",
			"Android.content.title": "Android! The eagle has landed!",
			"Android.content.payload.android": "android custom content!",
			"iOS.content.title": "Jobs! The eagle has landed!",
			"iOS.content.payload.ios": "iOS custom content!",
			"iOS.actionButtons.0.key": "REDIRECT",
			"iOS.actionButtons.0.label": "Redirect message",
			"iOS.actionButtons.0.autoDismissible": "true",
			"iOS.actionButtons.1.key": "DISMISS",
			"iOS.actionButtons.1.label": "Dismiss message",
			"iOS.actionButtons.1.actionType": "DismissAction",
			"iOS.actionButtons.1.isDangerousOption": "true",
			"iOS.actionButtons.1.autoDismissible": "true"
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

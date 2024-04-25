import { title } from "process"

export const newMessageNotification = (receiverToken: string, message: string, sender:any) => {
	const notificationPayload = {
		notification:{
			title: sender.name as string,
			body: message,
		},
		// data: {
		// 	message: message,
		// 	sender: sender,
		// 	type: 'new message',
		// },
		
		android:{
			notification:{
				sound: 'default',
				tag: 'new message',
				click_action: 'FLUTTER_NOTIFICATION_CLICK',
			}
		},
		// apns: {
		// 	headers: {
		// 		'apns-priority': '10',
		// 		'apns-push-type': 'background',
		// 		'apns-topic': 'shop.uniplanet.uniplanet',
		// 	},
		// 	payload: {
		// 		aps: {
		// 			'content-available': 1,
		// 		},
		// 	},
		// },
		token: receiverToken,
	}
	return notificationPayload
}

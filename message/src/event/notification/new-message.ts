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
					'content-available': 1,
					"badge": 15,
				},  
			},
			},
		token: receiverToken,
	}
	return notificationPayload
}

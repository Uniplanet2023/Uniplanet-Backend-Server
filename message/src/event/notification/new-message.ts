export const newMessageNotification = (receiverToken: string, message: string, sender: string) => {
	const notificationPayload = {
		data: {
			message: message,
			sender: sender,
			type: 'new message',
		},
		apns: {
			headers: {
				'apns-priority': '5',
				'apns-push-type': 'background',
				'apns-topic': 'shop.uniplanet.uniplanet',
			},
			payload: {
				aps: {
					'content-available': 1,
				},
			},
		},
		token: receiverToken,
	}
	return notificationPayload
}

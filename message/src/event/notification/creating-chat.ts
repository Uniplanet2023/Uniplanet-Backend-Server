export const creatingChatNotification = (receiverToken: string, chatJson: string, chat: any) => {
	const notificationPayload = {
		notification: {
			title: 'New Chat',
			body: chat.buyer.name + ' has started a chat with you',
		},
		data: {
			chat: chatJson,
			type: 'creating chat',
		},
		apns: {
			headers: {
				'apns-priority': '5',
				'apns-push-type': 'background',
				'apns-topic': 'com.example.uniplanetMobile',
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

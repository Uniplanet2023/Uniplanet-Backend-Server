export const creatingChatNotification = (receiverToken: string, chatJson: string, buyer: any) => {
	const notificationPayload = {
		notification: {
			title: 'New Chat',
			body: buyer.name + ' has started a chat with you',
		},
		data: {
			chat: chatJson,
			type: 'creating chat',
			content: `{
				"id":-1,
				"channelKey":"alerts",
				"displayOnForeground":false,
				"notificationLayout":"MessagingGroup",
				"largeIcon":"${buyer.profileImage}",
				"bigPicture":"${buyer.profileImage}",
				"showWhen":true,
				"autoDismissible":true,
				"privacy":"Private",
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
			]`,
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
				},
			},
		},
		token: receiverToken,
	}
	return notificationPayload
}

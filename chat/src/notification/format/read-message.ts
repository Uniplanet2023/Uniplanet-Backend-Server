export const readNotification = (receiverToken: string, totalCount: number) => {
	const notificationPayload = {
		data: {
			content: `{
				"id":-1,
				"badge":${totalCount},
				"channelKey":"chats",
				"displayOnForeground":false,
				"notificationLayout":"MessagingGroup",
				"showWhen":true,
				"autoDismissible":true,
				"privacy":"Private",
			}`,
		},
		apns: {
			headers: {
				'apns-priority': '5',
			},
			payload: {
				aps: {
					'content-available': 1,
					"badge": totalCount,
				},
			},
		},
		token: receiverToken,
	}
	return notificationPayload
}

import { title } from "process"

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
			body: message.message,
		},
		data: {
			content: "{\"id\":-1,\"badge\":1,\"channelKey\":\"alerts\",\"displayOnForeground\":true,\"notificationLayout\":\"BigPicture\",\"largeIcon\":\"https://br.web.img3.acsta.net/pictures/19/06/18/17/09/0834720.jpg\",\"bigPicture\":\"https://www.dw.com/image/49519617_303.jpg\",\"showWhen\":true,\"autoDismissible\":true,\"privacy\":\"Private\",\"payload\":{\"category\":\"like\",\"userId\":\"oUGw1AHfmkQPDuP9DOAT1J0iQ1X2\",\"ownerId\":\"AppleBoy\",\"notifId\":\"liked_279f33c9-9c58-4099-940b-06a463a9d929\",\"pageId\":\"notifsPage\",\"gameAction\":\"\"}}",
            actionButtons: "[{\"key\":\"REDIRECT\",\"label\":\"Redirect\",\"autoDismissible\":true},{\"key\":\"CANCEL\",\"label\":\"Dismiss\",\"actionType\":\"DismissAction\",\"isDangerousOption\":true,\"autoDismissible\":true}]"
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

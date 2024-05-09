import { redisClient } from '@uniplanet-lib/common'
import { newMessageNotification } from '../format/new-message'
import admin from 'firebase-admin'
import { UserDocument } from '../../models/user'
import { MessageDocument } from '../../models/message'

export async function sendingMessageNotification({
	message,
	sender,
	receiver,
}: {
	message: MessageDocument
	sender: UserDocument
	receiver: UserDocument
}) {
	const receiverToken = await redisClient.redis.get(receiver.id)
	try {
		if (receiverToken) {
			const messageNotification = await newMessageNotification(receiverToken, message, sender)

			admin
				.messaging()
				.send(messageNotification)
				.then(response => {
					console.log('Successfully sent message:', response)
				})
				.catch(error => {
					console.log('Error sending message:', error)
				})
		} else {
			console.log('receiverToken not found')
		}
	} catch (e) {
		console.log(e)
	}
}

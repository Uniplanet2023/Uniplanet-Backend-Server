import { redisClient } from '@uniplanet-lib/common'
import admin from 'firebase-admin'
import { UserDocument } from '../../models/user'
import { readNotification } from '../format/read-message'

export async function readMessageNotification({ totalCount, receiverId }: { totalCount: number; receiverId: string }) {
	const receiverToken = await redisClient.redis.get(receiverId)
	try {
		if (receiverToken) {
			const readNotificationContent = await readNotification(receiverToken, totalCount)

			admin
				.messaging()
				.send(readNotificationContent)
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

import { redisClient } from '@uniplanet-lib/common'
import { newMessageNotification } from '../format/new-message'
import admin from 'firebase-admin'
import { UserDocument } from '../../models/user'
import { MessageDocument } from '../../models/message'
import { ChatDocument } from '../../models/chat'

export async function sendingMessageNotification({
	message,
	sender,
	receiver,
	chat,
}: {
	message: MessageDocument
	sender: UserDocument
	receiver: UserDocument
	chat: ChatDocument
}) {
	const receiverToken = await redisClient.redis.get(`firebaseToken:${receiver._id}`)
	try {
		if (receiverToken) {
			const messageNotification = await newMessageNotification(receiverToken, message, sender, chat)

			admin
				.messaging()
				.send(messageNotification)
				.then(response => {
					
				})
				.catch(error => {
					console.log('Error sending message:', error)
				})
		} else {
			
		}
	} catch (e) {
		console.log(e)
	}
}

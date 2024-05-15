import { redisClient } from '@uniplanet-lib/common'
import { readMessageNotification } from '../notification/notification-api/read-message'

async function markChatMessagesAndSendNotification({ userId, chatId }: { userId: string; chatId: string }) {
	const unseenMessages = await getUnseenMessages({ userId, chatId });
	if (unseenMessages.length > 0) {
		await redisClient.redis.zRem(`user:${userId}:unseen`, unseenMessages)
	}
	return []
}

async function getUnseenMessages({ userId, chatId }: { userId: string; chatId: string }){
	const totalUnseenMessages = await redisClient.redis.zRange(`user:${userId}:unseen`, 0, -1)
	if (totalUnseenMessages.length > 0) {
		// Parse the messages from JSON
		const unseenMessagesArray = totalUnseenMessages.map(msg => JSON.parse(msg))

		// Filter and map messages related to the specific chat
		const unseenMessages = unseenMessagesArray.filter(msg => msg.chat == chatId).map(msg => JSON.stringify(msg))
		return unseenMessages;
	}
	return []

}
export {markChatMessagesAndSendNotification, getUnseenMessages}

import { redisClient } from '@uniplanet-lib/common'
import { readMessageNotification } from '../notification/notification-api/read-message'

async function markChatMessagesAndSendNotification({ userId, chatId }: { userId: string; chatId: string }) {
	const unseenMessages = await redisClient.redis.zRange(`user:${userId}:unseen`, 0, -1)
	if (unseenMessages.length > 0) {
		// Parse the messages from JSON
		const unseenMessagesArray = unseenMessages.map(msg => JSON.parse(msg))

		// Filter and map messages related to the specific chat
		const seenMessages = unseenMessagesArray.filter(msg => msg.chat === chatId).map(msg => JSON.stringify(msg))
		// Remove the seen messages from the Redis set
		if (seenMessages.length > 0) {
			await redisClient.redis.zRem(`user:${userId}:unseen`, seenMessages)
		}
		const totalCount = unseenMessages.length - seenMessages.length
		// Send notification to the receiver
		await readMessageNotification({ totalCount, receiverId: userId })

		return seenMessages
	}
	return []
}

export default markChatMessagesAndSendNotification

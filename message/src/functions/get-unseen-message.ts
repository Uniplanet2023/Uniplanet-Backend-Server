import { redisClient } from '@uniplanet-lib/common'

/**
 * Retrieves the count of unseen messages for a specific user.
 *
 * @param {string} userId - The user ID for whom to fetch the unseen message count.
 * @returns {Promise<number>} The count of unseen messages.
 */
async function getUnseenMessageCount(userId: string): Promise<number> {
	// Use ZCARD to get the count of elements in the sorted set of unseen messages
	const count = await redisClient.redis.zCard(`user:${userId}:unseen`)
	return count
}

export default getUnseenMessageCount

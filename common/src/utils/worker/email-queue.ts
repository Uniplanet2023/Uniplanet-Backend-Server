import { redisClient } from '@uniplanet-lib/common'
import { Queue } from 'bullmq'
import { MAIL_QUEUE } from './queue-name'

export async function initMailQueue() {
	// Set up BullMQ Queue with Redis connection
	return new Queue(MAIL_QUEUE, {
		connection: {
			host: process.env.REDIS_HOST!,
			port: parseInt(process.env.REDIS_PORT!),
			password: redisClient.redis.options?.password, // Use password if applicable
			db: redisClient.redis.options?.database, // Use specific DB if applicable
		},
	})
}

// Function to add email jobs to the queue
export async function queueEmails(emails: string[], title: string, html: string, description: string) {
	const BATCH_SIZE = 30 // Number of emails to send in each batch
	const emailQueue = await initMailQueue() // Initialize the queue after ensuring Redis is connected

	for (let i = 0; i < emails.length; i += BATCH_SIZE) {
		const batch = emails.slice(i, i + BATCH_SIZE)
		await emailQueue.add('sendEmails', {
			batch,
			title,
			html,
			description,
		})
		await new Promise(resolve => setTimeout(resolve, 100000)) // Delay between batches
	}
}

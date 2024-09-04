import { IScheduler, Scheduler, redisClient } from '@uniplanet-lib/common'
import User from '../models/user'
import Chat from '../models/chat'
import Message from '../models/message'
import { deleteFilesByPrefix } from '../config/firebase-delete-files'

class DeleteScheduler extends Scheduler {
	constructor() {
		// Schedule the job to run every day at 3 AM
		super('00 00 03 * * *')
	}

	async executeJob(): Promise<IScheduler> {
		const now = new Date()

		try {
			await this.deleteUsers(now)
			const chats = await this.deleteChats(now)
			await this.deleteMessages(chats)
			console.log('Chat Delete Scheduler completed successfully')
		} catch (err) {
			console.error('Error during Chat Delete Scheduler execution:', err)
		}

		return { success: true }
	}

	private async deleteUsers(now: Date): Promise<void> {
		try {
			await User.deleteMany({ deletionDate: { $lte: now } })
			console.log('Deleted users with deletionDate <=', now)
		} catch (error) {
			console.error('Error deleting users:', error)
		}
	}

	private async deleteChats(now: Date): Promise<any[]> {
		try {
			const chats = await Chat.find({ deletionDate: { $lte: now } })
			await Chat.deleteMany({ _id: { $in: chats.map(chat => chat._id) } })
			console.log('Deleted chats with deletionDate <=', now)

			for (const chat of chats) {
				await this.deleteChatResources(chat)
			}

			return chats
		} catch (error) {
			console.error('Error deleting chats:', error)
			return []
		}
	}

	private async deleteChatResources(chat: any): Promise<void> {
		try {
			const prefix = `chat-images/${chat.id}/`
			await deleteFilesByPrefix(prefix)
			const prefixVideo = `chat-videos/${chat.id}/`
			await deleteFilesByPrefix(prefixVideo)
			console.log(`Deleted files for chat ${chat.id}`)
		} catch (error) {
			console.error(`Error deleting files for chat ${chat.id}:`, error)
		}

		try {
			await redisClient.redis.del(`user:${chat.seller}:unseen`)
			await redisClient.redis.del(`user:${chat.buyer}:unseen`)
			console.log(`Deleted unseen message counters for chat ${chat.id}`)
		} catch (error) {
			console.error(`Error deleting unseen message counters for chat ${chat.id}:`, error)
		}
	}

	private async deleteMessages(chats: any[]): Promise<void> {
		try {
			await Message.deleteMany({ chat: { $in: chats.map(chat => chat._id) } })
			console.log('Deleted messages for deleted chats')
		} catch (error) {
			console.error('Error deleting messages:', error)
		}
	}
}

export default DeleteScheduler

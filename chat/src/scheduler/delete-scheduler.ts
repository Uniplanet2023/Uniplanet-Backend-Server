import { IScheduler, Scheduler, redisClient } from '@uniplanet-lib/common'
import User from '../models/user'
import Chat from '../models/chat'
import Message from '../models/message'
import { deleteFilesByPrefix } from '../config/firebase-delete-files'

class DeleteScheduler extends Scheduler {
	constructor() {
		// run every hour
		// second min hour (day of month) monrh (day of week month)
		super('00 00 03 * * *')
	}

	executeJob(): Promise<IScheduler> {
		const now = new Date()
		console.log('Chat Delete Scheduler is running')
		return new Promise(async resolve => {
			try {
				await User.deleteMany({ deletionDate: { $lte: now } })
				const chats = await Chat.find({ deletionDate: { $lte: now } })
				await Chat.deleteMany({ _id: { $in: chats.map(chat => chat._id) } })

				for (const chat of chats) {
					try {
						const prefix = 'chat-images/' + chat.id + '/';
						await deleteFilesByPrefix(prefix);
						console.log(`Deleted files for product ${chat.id}`);
					  } catch (error) {
						console.error(`Error deleting files for product ${chat.id}:`, error);
					  }
					try {
						await redisClient.redis.del(`user:${chat.seller}:unseen`)
						await redisClient.redis.del(`user:${chat.buyer}:unseen`)
					} catch (err) {
						console.error('Error deleting chat resources:', err)
						console.error('Possibly no images or folder to delete.')
					}
				}

				await Message.deleteMany({ deletionDate: { $lte: now } })
			} catch (err) {
				console.error('Error deleting chats:', err)
			}
			resolve({
				success: true,
			})
		})
	}
}
export default DeleteScheduler

import { IScheduler, NodemailerSmtpServer, Scheduler } from '@uniplanet-lib/common'
import User from '../models/user';
import Chat from '../models/chat';
import Message from '../models/message';
import { cloudinaryAPI } from '..';

class DeleteScheduler extends Scheduler {
	constructor() {
		// run every hour
		// second min hour (day of month) monrh (day of week month)
		super('00 00 03 * * *')
	}

	executeJob(): Promise<IScheduler> {
		const now = new Date();
        console.log('Chat Delete Scheduler is running');
        return new Promise(async resolve => {
			try {
				await User.deleteMany({ deletionDate: { $lte: now } });
				const chats = await Chat.find({ deletionDate: { $lte: now } });
				await Chat.deleteMany({ _id: { $in: chats.map(chat => chat._id) } });
	
				for (const chat of chats) {
					try {
						await cloudinaryAPI.api.delete_resources_by_prefix('chat-images/' + chat.id + '/');
						await cloudinaryAPI.api.delete_folder('chat-images/' + chat.id);
					} catch (err) {
						console.error('Error deleting chat resources:', err);
						console.error('Possibly no images or folder to delete.');
					}
				}
	
				await Message.deleteMany({ deletionDate: { $lte: now } });
			} catch (err) {
				console.error('Error deleting chats:', err);
			}	
            resolve({
                success: true,
            });
		})
	}
}
export default DeleteScheduler

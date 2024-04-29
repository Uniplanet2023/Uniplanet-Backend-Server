import { IScheduler, NodemailerSmtpServer, Scheduler } from '@uniplanet-lib/common'
import User from '../models/user';
import Chat from '../models/chat';
import Message from '../models/message';

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
			await User.deleteMany({ deletionDate: { $lte: now } })
            await Chat.deleteMany({ deletionDate: { $lte: now } })
            await Message.deleteMany({ deletionDate: { $lte: now } })
            resolve({
                success: true,
            });
		})
	}
}
export default DeleteScheduler

import { IScheduler, Scheduler } from '../scheduler'
import { Product, User, UserChatRoom } from '../../models'

class UserDeleteScheduler extends Scheduler {
	constructor() {
		// run every hour
		// second min hour (day of month) monrh (day of week month)
		super('00 00 04 * * *')
	}

	executeJob(): Promise<IScheduler> {
		const now = new Date()
		console.log(now.toLocaleTimeString())
		// TODO: Delete All the product, messages, userchat related to the User
		return new Promise(async resolve => {
			await User.deleteMany({ deletionDate: { $lte: now } })
			await Product.deleteMany({ deletionDate: { $lte: now } })
			await UserChatRoom.deleteMany({ deletionDate: { $lte: now } })
			resolve({
				success: true,
			})
		})
	}
}
export default UserDeleteScheduler

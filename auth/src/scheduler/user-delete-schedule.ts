import { IScheduler, Scheduler } from '@uniplanet-lib/common'
import { User } from '../models'

class UserDeleteScheduler extends Scheduler {
	constructor() {
		// run every hour
		// second min hour (day of month) monrh (day of week month)
		super('00 00 04 * * *')
	}

	executeJob(): Promise<IScheduler> {
		const now = new Date()

		return new Promise(async resolve => {
			await User.deleteMany({ deletionDate: { $lte: now } })
			resolve({
				success: true,
			})
		})
	}
}
export default UserDeleteScheduler

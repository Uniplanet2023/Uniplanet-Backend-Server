import { IScheduler, Scheduler } from '@uniplanet-lib/common'
import Account from '../models/account'

class UpdateFreeUserScheduler extends Scheduler {
	constructor() {
		// Schedule the job to run every day at 4 AM
		super('00 00 12 * * *')
	}

	async executeJob(): Promise<IScheduler> {
		const now = new Date()
		console.log(`User Delete Scheduler running at ${now.toLocaleTimeString()}`)

		try {
			const accounts = await Account.find({ subscription: 'free' })

			for (const account of accounts) {
				try {
					account.numberOfFreeItemClick = 3
                    await account.save()
				} catch (error) {
					console.error(`Error processing account ${account._id}:`, error)
				}
			}

			console.log('Update Free User Scheduler completed successfully')
			return { success: true }
		} catch (err) {
			console.error('Error during Updating Free User Scheduler execution:', err)
			return { success: false }
		}
	}

}

export default UpdateFreeUserScheduler

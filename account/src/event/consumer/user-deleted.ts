import { Topics, BaseConsumer, UserDeletedEvent } from '@uniplanet-lib/common'
import Account from '../../models/account'

// Extend the BaseConsumer for the user:created event
export default class UserDeletedConsumer extends BaseConsumer<UserDeletedEvent> {
	topic: Topics.UserDeleted = Topics.UserDeleted

	// Implement the onMessage method
	async onMessage(data: UserDeletedEvent['data']): Promise<void> {
		// Process the user:created message, e.g., send an email
		console.log(`user Deleted ${data.id} -- account server`)
		const deletionDate = new Date()
		deletionDate.setDate(deletionDate.getDate() + 7) // Adds 7 days to the current date

		await Account.updateOne({ _id: data.id }, { $set: { deletionDate: deletionDate } })
		console.log('account deleted successfully')
	}
}

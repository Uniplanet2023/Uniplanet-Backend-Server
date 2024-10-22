import { Topics, BaseConsumer, UserUpdateEvent } from '@uniplanet-lib/common'
import Account from '../../models/account'

// Extend the BaseConsumer for the user:created event
export default class UserUpdatedConsumer extends BaseConsumer<UserUpdateEvent> {
	topic: Topics.UserUpdated = Topics.UserUpdated

	// Implement the onMessage method
	async onMessage(data: UserUpdateEvent['data']): Promise<void> {
		// Process the user:created message, e.g., send an email

		try {
			if (data.deletionDate != null) {
				await Account.updateOne({ _id: data.id }, { $set: { deletionDate: null } })
			}
		} catch (e) {
			console.error(e)
		}
	}
}

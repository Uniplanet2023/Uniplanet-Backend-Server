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
			if (data.unSeenMessages != undefined) {
				const account = await Account.findById(data.id)
				if (account == null) {
					throw new Error('Account not found')
				} else if (account.unSeenNotification == null) {
					account.unSeenNotification = 0
				}

				account.unSeenNotification += data.unSeenMessages as number

				if (account.unSeenNotification < 0) {
					account.unSeenNotification = 0
				}
				await account.save()
			}
		} catch (e) {
			console.error(e)
		}
	}
}

import { Topics, BaseConsumer, UserCreatedEvent } from '@uniplanet-lib/common'
import Account from '../../models/account'
import Advertiser from '../../models/advertiser'

// Extend the BaseConsumer for the user:created event
export default class UserCreatedConsumer extends BaseConsumer<UserCreatedEvent> {
	topic: Topics.UserCreated = Topics.UserCreated

	// Implement the onMessage method
	async onMessage(data: UserCreatedEvent['data']): Promise<void> {
		// Process the user:created message, e.g., send an email
		console.log(`user Created ${data.email} -- account server`)

		const account = Account.build({
			_id: data.id,
			name: data.name,
			email: data.email,
			profileImage: data.profileImage,
			school: data.school,
			isBlocked: false,
			isBlockedChat: false,
			isBlockedPost: false,
			type: data.type,
		})
		await account.save()
		if (data.type === 'advertiser') {
			const advertiser = Advertiser.build({
				account: account.id,
			})
			await advertiser.save()
		}

		console.log('account created successfully')
	}
}

import { Topics, BaseConsumer, UserCreatedEvent } from '@uniplanet-lib/common'
import Account from '../../models/account'

// Extend the BaseConsumer for the user:created event
export default class UserCreatedConsumer extends BaseConsumer<UserCreatedEvent> {
	topic: Topics.UserCreated = Topics.UserCreated

	// Implement the onMessage method
	async onMessage(data: UserCreatedEvent['data']): Promise<void> {
		// Process the user:created message, e.g., send an email
		console.log(`user Created ${data.email} -- account server`)
		let type = 'user'
		if (!data.email.endsWith('.edu')) {
			type = 'visitor'
		}
		const account = Account.build({
			_id: data.id,
			name: data.name,
			email: data.email,
			profileImage: data.profileImage,
			school: data.school,
			maximumPost: type === 'visitor' ? 0 : undefined,
			maximumClick: type === 'visitor' ? 0 : undefined,
		})
		await account.save()
		console.log('account created successfully')
	}
}

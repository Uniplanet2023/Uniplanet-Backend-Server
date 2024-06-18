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
		let type = 'student'
		if (!data.email.endsWith('.edu')) {
			type = 'advertiser'
		}
		const account = Account.build({
			_id: data.id,
			name: data.name,
			email: data.email,
			profileImage: data.profileImage,
			school: data.school,
			isBlocked: type === 'advertiser' ? true : false,
			isBlockedChat: type === 'advertiser' ? true : false,
			isBlockedPost: type === 'advertiser' ? true : false,
			type: type,
		})
		await account.save();
		if(type === 'advertiser') {
			const advertiser = Advertiser.build({
				account: account.id,
			});
			await advertiser.save();
		}
		
		
		console.log('account created successfully')
	}
}

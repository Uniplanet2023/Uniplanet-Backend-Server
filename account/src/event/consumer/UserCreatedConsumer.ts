import { Kafka, EachMessagePayload } from 'kafkajs'
import { Topics, BaseConsumer, UserCreatedEvent, redisClient } from '@uniplanet-lib/common'
import Account from '../../models/account'
import { profile } from 'console'
import GetAccountInfo from '../serializer/get-account'

// Extend the BaseConsumer for the user:created event
export default class UserCreatedConsumer extends BaseConsumer<UserCreatedEvent> {
	topic: Topics.UserCreated = Topics.UserCreated

	constructor(kafka: Kafka, groupId: string) {
		super(kafka, groupId)
	}
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
		})
		await account.save()
		console.log('account created successfully')
	}
}

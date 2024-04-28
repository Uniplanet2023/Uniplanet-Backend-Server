import { Kafka, EachMessagePayload } from 'kafkajs'
import { Topics, BaseConsumer, UserCreatedEvent, redisClient, UserDeletedEvent } from '@uniplanet-lib/common'
import Account from '../../models/account'
import { profile } from 'console'
import GetAccountInfo from '../serializer/get-account'

// Extend the BaseConsumer for the user:created event
export default class UserDeletedConsumer extends BaseConsumer<UserDeletedEvent> {
	topic: Topics.UserDeleted = Topics.UserDeleted

	constructor(kafka: Kafka, groupId: string) {
		super(kafka, groupId)
	}
	// Implement the onMessage method
	async onMessage(data: UserDeletedEvent['data']): Promise<void> {
		// Process the user:created message, e.g., send an email
		console.log(`user Deleted ${data.id} -- account server`)
		
		await Account.updateOne({_id: data.id},  { $set: { deletionDate: new Date() } })
		console.log('account deleted successfully')
	}
}

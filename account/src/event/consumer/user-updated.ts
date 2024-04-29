import { Kafka, EachMessagePayload } from 'kafkajs'
import { Topics, BaseConsumer, UserCreatedEvent, redisClient, UserDeletedEvent, UserUpdateEvent } from '@uniplanet-lib/common'
import Account from '../../models/account'
import { profile } from 'console'
import GetAccountInfo from '../serializer/get-account'

// Extend the BaseConsumer for the user:created event
export default class UserUpdatedConsumer extends BaseConsumer<UserUpdateEvent> {
	topic: Topics.UserUpdated = Topics.UserUpdated

	constructor(kafka: Kafka, groupId: string) {
		super(kafka, groupId)
	}
	// Implement the onMessage method
	async onMessage(data: UserUpdateEvent['data']): Promise<void> {
		// Process the user:created message, e.g., send an email
		console.log(`user update ${data.id} -- account server`)
		if(data.deletionDate == undefined) {
            await Account.updateOne({_id: data.id},  { $set: { deletionDate: null } })
        }
	}
}

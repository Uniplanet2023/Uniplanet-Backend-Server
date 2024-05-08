import { Kafka, EachMessagePayload } from 'kafkajs'
import {
	Topics,
	BaseConsumer,
	UserCreatedEvent,
	redisClient,
	UserDeletedEvent,
	UserUpdateEvent,
} from '@uniplanet-lib/common'
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
		try{
			if (data.deletionDate == undefined) {
				await Account.updateOne({ _id: data.id }, { $set: { deletionDate: null } })
			}
			if(data.unSeenMessages != undefined) {
				const account = await Account.findById(data.id);
				if(account == null) {
					throw new Error('Account not found');
				}else if(account.unSeenMessages == null) {
					account.unSeenMessages = 0;
				}
				account.unSeenMessages += data.unSeenMessages;
				if(account.unSeenMessages < 0) {
					account.unSeenMessages = 0;
				}
				await account.save();
			}
		}catch(e) {
			console.error(e)
		}
		
	}
}

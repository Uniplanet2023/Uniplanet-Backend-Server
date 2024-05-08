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
		console.log(data)
		try{
			if (data.deletionDate == undefined) {
				await Account.updateOne({ _id: data.id }, { $set: { deletionDate: null } })
			}
			if(data.unSeenMessages != undefined) {
				const account = await Account.findById(data.id);
				if(account == null) {
					throw new Error('Account not found');
				}else if(account.unSeenNotification == null) {
					account.unSeenNotification = 0;
				}
				console.log(data.unSeenMessages as number + 1);
				account.unSeenNotification += data.unSeenMessages as number;
				console.log(account.unSeenNotification);
				if(account.unSeenNotification < 0) {
					account.unSeenNotification = 0;
				}
				await account.save();
			}
		}catch(e) {
			console.error(e)
		}
		
	}
}

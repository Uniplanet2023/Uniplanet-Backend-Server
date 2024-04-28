import { Kafka, EachMessagePayload } from 'kafkajs'
import { Topics, BaseConsumer, UserDeletedEvent } from '@uniplanet-lib/common'
import Chat from '../../models/chat'
import User from '../../models/user'
import Message from '../../models/message'

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
		
        await Chat.updateMany(
			{ $or: [{ seller: data.id }, { buyer: data.id }] },
			{ $set: { deletionDate: new Date() } }
		  );
		  
		  await User.updateOne(
			{ _id: data.id },
			{ $set: { deleteDate: new Date() } }
		  );
		  
		  await Message.updateMany(
			{ $or: [{ sender: data.id }, { receiver: data.id }] },
			{ $set: { deletionDate: new Date() } }
		  );
		  

		console.log('account deleted successfully')
	}
}

import { Kafka, EachMessagePayload } from 'kafkajs'
import { Topics, BaseConsumer, UserDeletedEvent } from '@uniplanet-lib/common'
import Chat from '../../models/chat'
import User from '../../models/user'
import Message from '../../models/message'

// Extend the BaseConsumer for the user:created event
export class UserDeletedConsumer extends BaseConsumer<UserDeletedEvent> {
	topic: Topics.UserDeleted = Topics.UserDeleted

	constructor(kafka: Kafka, groupId: string) {
		super(kafka, groupId)
	}
	// Implement the onMessage method
	async onMessage(data: UserDeletedEvent['data']): Promise<void> {
		// Process the user:created message, e.g., send an email
		console.log(`user Deleted ${data.id} -- account server`)
		const deletionDate = new Date()
		deletionDate.setDate(deletionDate.getDate() + 7) // Adds 7 days to the current date

		await Chat.updateMany({ $or: [{ seller: data.id }, { buyer: data.id }] }, { $set: { deletionDate: deletionDate } })

		await User.updateOne({ _id: data.id }, { $set: { deleteDate: deletionDate } })

		await Message.updateMany(
			{ $or: [{ sender: data.id }, { receiver: data.id }] },
			{ $set: { deletionDate: deletionDate } },
		)

		console.log('account deleted successfully')
	}
}

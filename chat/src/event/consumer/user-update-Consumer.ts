import { Topics, BaseConsumer, UserUpdateEvent } from '@uniplanet-lib/common'
import User from '../../models/user'
import Chat from '../../models/chat'
import Message from '../../models/message'

// Extend the BaseConsumer for the user:created event
export default class UserUpdateConsumer extends BaseConsumer<UserUpdateEvent> {
	topic: Topics.UserUpdated = Topics.UserUpdated

	// Implement the onMessage method
	async onMessage(data: UserUpdateEvent['data']): Promise<void> {
		try {
			console.log('consume UserUpdateEvent Kafka')
			console.log(data)
			if (data.name) {
				await User.findByIdAndUpdate({ _id: data.id }, { name: data.name })
			} else if (data.profileImage) {
				await User.findByIdAndUpdate({ _id: data.id }, { profileImage: data.profileImage })
			} else if (data.deletionDate != null) {
				
				await Chat.updateMany(
					{ $or: [{ seller: data.id }, { buyer: data.id }] },
					{ $set: { deletionDate: null } }
				  );
				  
				  await User.updateOne(
					{ _id: data.id },
					{ $set: { deleteDate: null } }
				  );
				  
				  await Message.updateMany(
					{ $or: [{ sender: data.id }, { receiver: data.id }] },
					{ $set: { deletionDate: null } }
				  );
			}
		} catch (err) {
			console.log(err)
		}
	}
}

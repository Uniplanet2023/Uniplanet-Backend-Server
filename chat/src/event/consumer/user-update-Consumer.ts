import { Topics, BaseConsumer, UserUpdateEvent } from '@uniplanet-lib/common'
import User from '../../models/user'
import Chat from '../../models/chat'
import Message from '../../models/message'

// Extend the BaseConsumer for the user:created event
export class UserUpdateConsumer extends BaseConsumer<UserUpdateEvent> {
	topic: Topics.UserUpdated = Topics.UserUpdated

	// Implement the onMessage method
	async onMessage(data: UserUpdateEvent['data']): Promise<void> {
		try {
			
			if (data.name) {
				await User.findByIdAndUpdate({ _id: data.id }, { name: data.name })
			}
			if (data.profileImage) {
				await User.findByIdAndUpdate({ _id: data.id }, { profileImage: data.profileImage })
			}
			if (data.deletionDate != null) {
				await Chat.updateMany({ $or: [{ seller: data.id }, { buyer: data.id }] }, { $set: { deletionDate: null } })

				await User.updateOne({ _id: data.id }, { $set: { deleteDate: null } })

				await Message.updateMany(
					{ $or: [{ sender: data.id }, { receiver: data.id }] },
					{ $set: { deletionDate: null } },
				)
			}
			if (data.isBlocked != null) {
				await User.updateOne({ _id: data.id }, { $set: { isBlocked: data.isBlocked } })
			}
			if (data.canGetFreeItems != null){
				await User.updateOne({ _id: data.id }, { $set: { canGetFreeItems: data.canGetFreeItems } });
			}
		} catch (err) {
			console.log(err)
		}
	}
}

import { Topics, BaseConsumer, UserUpdateEvent } from '@uniplanet-lib/common'
import User from '../../models/user'

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
			}
		} catch (err) {
			console.log(err)
		}
	}
}

import { Kafka, EachMessagePayload } from 'kafkajs'
import { Topics, BaseConsumer, MessageCreatedEvent, MessageReadEvent, MessageReadAllEvent, UserUpdateEvent } from '@uniplanet-lib/common'
import { profile } from 'console'
import Message from '../../models/message'
import Chat from '../../models/chat'
import User from '../../models/user'

// Extend the BaseConsumer for the user:created event
export default class UserUpdateConsumer extends BaseConsumer<UserUpdateEvent> {
	topic: Topics.UserUpdated = Topics.UserUpdated

	constructor(kafka: Kafka, groupId: string) {
		super(kafka, groupId)
	}
	// Implement the onMessage method
	async onMessage(data: UserUpdateEvent['data']): Promise<void> {
		try {
			console.log('consume UserUpdateEvent Kafka')
			console.log(data)
            if(data.name){
                await User.findByIdAndUpdate({ _id: data.id }, { name: data.name })
            }else if(data.profileImage){
                await User.findByIdAndUpdate({ _id: data.id }, { profileImage: data.profileImage })
            }
		} catch (err) {
			console.log(err)
		}
	}
}

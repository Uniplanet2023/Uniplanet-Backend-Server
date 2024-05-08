import { Topics, BaseProducer, UserUpdateEvent } from '@uniplanet-lib/common'

// Extend the BaseConsumer for the user:created event
export class UserUpdateProducer extends BaseProducer<UserUpdateEvent> {
	topic: Topics.UserUpdated = Topics.UserUpdated
}

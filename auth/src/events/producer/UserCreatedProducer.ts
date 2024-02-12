import { Topics, BaseProducer, UserCreatedEvent } from '@uniplanet-lib/common'

// Extend the BaseConsumer for the user:created event
export class UserCreatedProducer extends BaseProducer<UserCreatedEvent> {
	topic: Topics.UserCreated = Topics.UserCreated
}

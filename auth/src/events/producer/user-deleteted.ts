import { Topics, BaseProducer, UserDeletedEvent } from '@uniplanet-lib/common'

// Extend the BaseConsumer for the user:created event
export class UserDeletedProducer extends BaseProducer<UserDeletedEvent> {
	topic: Topics.UserDeleted = Topics.UserDeleted
}

import { Topics, BaseProducer, MessageCreatedEvent } from '@uniplanet-lib/common'

// Extend the BaseConsumer for the user:created event
export class MessageCreatedProducer extends BaseProducer<MessageCreatedEvent> {
	topic: Topics.MessageCreated = Topics.MessageCreated
}

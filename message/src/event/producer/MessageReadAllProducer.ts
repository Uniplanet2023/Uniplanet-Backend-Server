import { Topics, BaseProducer, MessageReadAllEvent } from '@uniplanet-lib/common'

// Extend the BaseConsumer for the user:created event
export class MessageReadAllProducer extends BaseProducer<MessageReadAllEvent> {
	topic: Topics.MessageReadAll = Topics.MessageReadAll
}

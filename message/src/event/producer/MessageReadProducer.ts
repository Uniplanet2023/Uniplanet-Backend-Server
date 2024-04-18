import { Topics, BaseProducer, MessageReadEvent } from '@uniplanet-lib/common'

// Extend the BaseConsumer for the user:created event
export class MessageReadProducer extends BaseProducer<MessageReadEvent> {
	topic: Topics.MessageRead = Topics.MessageRead
}

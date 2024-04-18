import { Topics, BaseProducer, ChatCreatedEvent } from '@uniplanet-lib/common'

// Extend the BaseConsumer for the user:created event
export class CreateChatProducer extends BaseProducer<ChatCreatedEvent> {
	topic: Topics.ChatCreate = Topics.ChatCreate
}

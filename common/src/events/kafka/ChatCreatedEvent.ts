import { Topics } from './topics'

export interface ChatCreatedEvent {
	topic: Topics.ChatCreate
	data: {
		productId: string
	}
}

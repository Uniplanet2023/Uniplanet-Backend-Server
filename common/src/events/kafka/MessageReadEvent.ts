import { Topics } from './topics'

export interface MessageReadEvent {
	topic: Topics.MessageRead
	data: {
		messageId: string
		readDate: Date
	}
}

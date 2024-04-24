import { Topics } from './topics'

export interface MessageCreatedEvent {
	topic: Topics.MessageCreated
	data: {
		sender: string
		receiver: string
		message: string
		messageType: string
		chat: string
		createdAt: Date
		readDate?: Date
	}
}

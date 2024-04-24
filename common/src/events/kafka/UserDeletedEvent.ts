import { Topics } from './topics'

export interface UserDeletedEvent {
	topic: Topics.UserDeleted
	data: {
		id: string
	}
}

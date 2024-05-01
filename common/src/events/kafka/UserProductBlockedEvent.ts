import { Topics } from './topics'

export interface UserProductBlockedEvent {
	topic: Topics.UserProductBlocked
	data: {
		id: string
	}
}

import { Topics } from './topics'

export interface UserPostBlockedEvent {
	topic: Topics.UserPostBlocked
	data: {
		id: string
		postBlock: boolean
	}
}

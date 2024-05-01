import { Topics } from './topics'

export interface UserChatBlockedEvent {
	topic: Topics.UserChatBlocked
	data: {
		id: string
	}
}

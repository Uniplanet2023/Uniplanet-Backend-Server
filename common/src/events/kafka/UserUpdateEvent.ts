import { Topics } from './topics'

export interface UserUpdateEvent {
	topic: Topics.UserUpdated
	data: {
		id: string
		name?: string
		profileImage?: string
	}
}

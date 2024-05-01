import { Topics } from './topics'

export interface PostDeletionRequestEvent {
	topic: Topics.PostDeletionRequest
	data: {
		id: string
	}
}

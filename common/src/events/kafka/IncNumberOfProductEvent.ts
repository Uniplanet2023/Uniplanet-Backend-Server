import { Topics } from './topics'

export interface IncNumberOfProductEvent {
	topic: Topics.IncreasePost
	data: {
		productId: string
	}
}

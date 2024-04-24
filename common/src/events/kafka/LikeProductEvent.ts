import { Topics } from './topics'

export interface LikeProductEvent {
	topic: Topics.LikeCreate
	data: {
		productId: string
	}
}

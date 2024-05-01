import { Topics } from './topics'

export interface IncNumberOfClickEvent {
	topic: Topics.IncreaseClick
	data:{
		id: string
		productId: string
	}
}

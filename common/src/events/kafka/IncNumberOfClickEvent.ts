import { Topics } from './topics'

export interface IncNumberOfClickEvent {
	topic: Topics.IncreaseClick
	data: {
		id: string
		title: string
	}
}

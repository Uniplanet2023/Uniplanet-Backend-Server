import { Topics } from './topics'

export interface DecreaseNumberOfFreeItemEvent {
	topic: Topics.DecNumberOfFreeItemClick
	data: {
		accountId: string
	}
}

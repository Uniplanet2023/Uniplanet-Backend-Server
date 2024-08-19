import { Topics } from './topics'

export interface DecreaseNumberOfFreeItemEvent {
	topic: Topics.DecNumberOfFreeItemClick
	data: {
		account_id: string
        type: string
	}
}

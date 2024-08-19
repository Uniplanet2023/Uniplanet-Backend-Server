import { Topics } from './topics'

export interface DecreaseNumberOfFreeItemEvent {
	topic: Topics.ChatCreate
	data: {
		account_id: string
        type: string
	}
}

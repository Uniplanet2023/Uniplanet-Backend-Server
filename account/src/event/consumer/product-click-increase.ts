import { Kafka, EachMessagePayload } from 'kafkajs'
import {
	Topics,
	BaseConsumer,
	UserCreatedEvent,
	redisClient,
	IncNumberOfProductEvent,
	IncNumberOfClickEvent,
} from '@uniplanet-lib/common'
import Account from '../../models/account'
import { profile } from 'console'
import GetAccountInfo from '../serializer/get-account'
import { postDeletionReqProducer, userPostBlockProducer } from '../..'

// Extend the BaseConsumer for the user:created event
export default class ClickIncreaseConsumer extends BaseConsumer<IncNumberOfClickEvent> {
	topic: Topics.IncreaseClick = Topics.IncreaseClick

	constructor(kafka: Kafka, groupId: string) {
		super(kafka, groupId)
	}
	// Implement the onMessage method
	async onMessage(data: IncNumberOfClickEvent['data']): Promise<void> {
		// Process the user:created message, e.g., send an email
		console.log(`account click increase ${data.id} -- account server`)
		const account = await Account.findOne({ _id: data.id })
		if (!account) {
			throw new Error('Account not found')
		}
		account.numberOfClick += 1
		if (account.maximumClick && account.numberOfClick >= account.maximumClick) {
			account.isBlockedPost = true
			// Product Deletion Request
			postDeletionReqProducer.sendMessage({
				id: account._id,
			})
			// Product Upload Block
			userPostBlockProducer.sendMessage({
				id: account._id,
			})
		}
		await account.save()
		console.log('account number of click increase successfully')
	}
}

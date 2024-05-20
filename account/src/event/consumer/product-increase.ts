import { Topics, BaseConsumer, IncNumberOfProductEvent } from '@uniplanet-lib/common'
import Account from '../../models/account'
import { userPostBlockProducer } from '../..'

// Extend the BaseConsumer for the user:created event
export default class ProductIncreaseConsumer extends BaseConsumer<IncNumberOfProductEvent> {
	topic: Topics.IncreasePost = Topics.IncreasePost

	// Implement the onMessage method
	async onMessage(data: IncNumberOfProductEvent['data']): Promise<void> {
		// Process the user:created message, e.g., send an email
		console.log(`account product increase ${data.id} -- account server`)
		const account = await Account.findOne({ _id: data.id })
		if (!account) {
			throw new Error('Account not found')
		}
		account.numberOfPost += 1
		if (account.maximumPost && account.numberOfPost >= account.maximumPost) {
			account.isBlockedPost = true
			// Product Upload Block
			userPostBlockProducer.sendMessage({
				id: account._id,
			})
		}
		await account.save()
		console.log('account number of product increase successfully')
	}
}

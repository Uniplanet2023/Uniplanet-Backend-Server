import { Topics, BaseConsumer, IncNumberOfClickEvent } from '@uniplanet-lib/common'
import Account from '../../models/account'
import { postDeletionReqProducer, userPostBlockProducer } from '../..'
import Advertiser from '../../models/advertiser'
import AdInteraction from '../../models/ad-interaction'

// Extend the BaseConsumer for the user:created event
export default class ClickIncreaseConsumer extends BaseConsumer<IncNumberOfClickEvent> {
	topic: Topics.IncreaseClick = Topics.IncreaseClick

	// Implement the onMessage method
	async onMessage(data: IncNumberOfClickEvent['data']): Promise<void> {
		// Process the user:created message, e.g., send an email
		console.log(`account click increase ${data.id} -- account server`)
		const account = await Account.findOne({ _id: data.id })
		if (!account) {
			throw new Error('Account not found')
		}
		if(account.type === 'advertiser') {
			const advertiser = await Advertiser.findOne({ account: account.id });
			if(!advertiser) {
				throw new Error('Advertiser not found')
			}
			await AdInteraction.build({
				advertiser: advertiser.id,
				account: account.id,
				advertisement: data.title,
			}).save();

			advertiser.spent += advertiser.costPerClick;
			// Check if the advertiser has credit, if so, use the credit first
			if(advertiser.myCredit > 0){
				advertiser.myCredit -= advertiser.costPerClick;
			}else{
				advertiser.budget -= advertiser.costPerClick;
			}
			// Check if the advertiser's budget is less than or equal to 0
			// If so, block the account
			if(advertiser.budget + advertiser.myCredit <= 0) {
				account.isBlocked = true;
				account.isBlockedPost = true;
				account.isBlockedChat = true;
				// Post Deletion Request
				postDeletionReqProducer.sendMessage({
					id: account._id,
				})
				// Product Upload Block
				userPostBlockProducer.sendMessage({
					id: account._id,
				})
			}
			await advertiser.save();
		}

		await account.save()
		console.log('account number of click increase successfully')
	}
}

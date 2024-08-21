import { Topics, BaseConsumer, DecreaseNumberOfFreeItemEvent } from '@uniplanet-lib/common'
import Account from '../../models/account'


// Extend the BaseConsumer for the user:created event
export default class DecNumberOfFreeItem extends BaseConsumer<DecreaseNumberOfFreeItemEvent> {
	topic: Topics.DecNumberOfFreeItemClick = Topics.DecNumberOfFreeItemClick

	// Implement the onMessage method
	async onMessage(data: DecreaseNumberOfFreeItemEvent['data']): Promise<void> {
		try {
            const account = await Account.findById(data.accountId);
			if (!account) {
				throw new Error('Account not found')
			}
			if(account.subscription == 'free'){
				account.numberOfFreeItemClick -= 1;
				await account.save()
			}
		} catch (err) {
			console.log(err)
		}
	}
}

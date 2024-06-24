import { Topics, BaseConsumer, IncNumberOfClickEvent } from '@uniplanet-lib/common'
import Account from '../../models/account'
import { postDeletionReqProducer, userPostBlockProducer } from '../..'
import Advertiser from '../../models/advertiser'
import AdInteraction from '../../models/ad-interaction'
import AdDailyStats from '../../models/ad-daily-stats'
import mongoose, { ObjectId, Types } from 'mongoose'


// Inside your click event handler
async function handleAdClick(advertiserId:ObjectId, advertisementTitle:string) {
  const today = new Date();
  const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());

  const adDailyStats = await AdDailyStats.findOneAndUpdate(
    {
      advertiser: advertiserId,
      advertisement: advertisementTitle,
      date: startOfDay,
    },
    {
      $inc: { clickCount: 1 },
    },
    { upsert: true, new: true }
  );

  if (!adDailyStats) {
    await AdDailyStats.build({
      advertiser: advertiserId,
      advertisement: advertisementTitle,
      date: startOfDay,
      clickCount: 1,
    }).save();
  }
}
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
			const existingUser = await AdInteraction.findOne({ advertiser: advertiser.id, advertisement: data.title, account: data.clickedUserId });
			if(!existingUser) {
				const client = await Account.findById(data.clickedUserId);
				if(client){
					await AdInteraction.build({
						advertiser: advertiser.id,
						account: client.id,
						advertisement: data.title,
					}).save();		
				}
			}
			handleAdClick(advertiser.id, data.title);
			// Check if the advertiser has credit, if so, use the credit first
			if(advertiser.freeCreditUsed <= advertiser.freeCredit){
				advertiser.freeCreditUsed += advertiser.costPerClick;
			}else{
				advertiser.creditUsed += advertiser.costPerClick;
			}
			// Check if the advertiser's budget is less than or equal to 0
			// If so, block the account
			if(advertiser.creditUsed + advertiser.freeCreditUsed >= advertiser.freeCredit && advertiser.credit <= 0) {
				account.isBlocked = true;
				account.isBlockedPost = true;
				account.isBlockedChat = true;
				// Product Deletion Request
				postDeletionReqProducer.sendMessage({
					id: account._id,
				})
				// User Upload Block
				userPostBlockProducer.sendMessage({
					id: account._id,
					postBlock: true,
				})
			}
			await advertiser.save();
		}

		await account.save()
		console.log('account number of click increase successfully')
	}
}

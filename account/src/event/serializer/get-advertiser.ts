import { BaseSerializeEvent } from '@uniplanet-lib/common'
import { GetAccountRestPayload, GetAdvertiserRestPayload } from './type-def'
import { AdvertiserDocument } from '../../models/advertiser'

export default class GetAdvertiserInfo extends BaseSerializeEvent<GetAdvertiserRestPayload> {
	private advertiser: AdvertiserDocument
	private account: GetAccountRestPayload

	private statusCode = 201

	constructor(advertiser: AdvertiserDocument, account: GetAccountRestPayload) {
		super()
		this.advertiser = advertiser
		this.account = account
	}

	getStatusCode(): number {
		return this.statusCode
	}

	serializeRest(): GetAdvertiserRestPayload {
		return {
			id: this.account.id,
			name: this.account.name,
			email: this.account.email,
			profileImage: this.account.profileImage,
			school: this.account.school,
			type: this.account.type,
			isBlocked: this.account.isBlocked,
			isBlockedPost: this.account.isBlockedPost,
			isBlockedChat: this.account.isBlockedChat,
			maximumPost: this.advertiser.maximumPost,
			numberOfPost: this.advertiser.numberOfPost,
			costPerClick: this.advertiser.costPerClick,
			freeCreditUsed: this.advertiser.freeCreditUsed,
			freeCredit: this.advertiser.freeCredit,
			credit: this.advertiser.credit,
			creditUsed: this.advertiser.creditUsed,
			subscription: this.account.subscription,
			numberOfFreeItemClick: this.account.numberOfFreeItemClick,
		}
	}
}

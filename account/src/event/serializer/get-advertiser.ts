import { BaseSerializeEvent } from '@uniplanet-lib/common'
import { GetAccountRestPayload, GetAdvertiserRestPayload } from './type-def'
import { AdvertiserDocument } from '../../models/advertiser'


export default class GetAdvertiserInfo extends BaseSerializeEvent<GetAdvertiserRestPayload> {
	private advertiser: AdvertiserDocument
    private account: GetAccountRestPayload

	private statusCode = 201

	constructor(advertiser: AdvertiserDocument, account:GetAccountRestPayload ) {
		super()
		this.advertiser = advertiser
        this.account = account
	}

	getStatusCode(): number {
		return this.statusCode
	}

	serializeRest(): GetAdvertiserRestPayload {
		return {
			id: this.advertiser._id,
            account: this.account,
			maximumPost: this.advertiser.maximumPost,
            numberOfPost: this.advertiser.numberOfPost,
            costPerClick: this.advertiser.costPerClick,
            myCredit: this.advertiser.myCredit,
            buget: this.advertiser.buget,
            spent: this.advertiser.spent,
		}
	}
}

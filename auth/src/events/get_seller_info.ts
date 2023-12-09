import { BaseAuthEvent } from './base_auth_event'
import { UserDocument } from '../models'
import { SellerRestPayload } from './type_def'

export default class GetSellerInfo extends BaseAuthEvent<SellerRestPayload> {
	private seller: UserDocument

	private statusCode = 201

	constructor(seller: UserDocument) {
		super()
		this.seller = seller
	}

	getStatusCode(): number {
		return this.statusCode
	}

	serializeRest(): SellerRestPayload {
		return {
			id: this.seller._id,
			name: this.seller.name,
			email: this.seller.email,
			profileImage: this.seller.profileImage,
			school: this.seller.school,
			verified: this.seller.verified,
			selling: this.seller.selling,
			sold: this.seller.sold,
			type: this.seller.type,
		}
	}
}

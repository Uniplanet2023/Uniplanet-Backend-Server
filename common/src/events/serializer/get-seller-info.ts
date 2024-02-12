// import { UserDocument } from '../../models'
// import BaseSerializeEvent from './base-serialize-event'
// import { SellerRestPayload } from './type-def'

// export default class GetSellerInfo extends BaseSerializeEvent<SellerRestPayload> {
// 	private seller: UserDocument

// 	private statusCode = 201

// 	constructor(seller: UserDocument) {
// 		super()
// 		this.seller = seller
// 	}

// 	getStatusCode(): number {
// 		return this.statusCode
// 	}

// 	serializeRest(): SellerRestPayload {
// 		return {
// 			id: this.seller._id,
// 			name: this.seller.name,
// 			email: this.seller.email,
// 			profileImage: this.seller.profileImage,
// 			school: this.seller.school,
// 			verified: this.seller.verified,
// 			selling: this.seller.selling,
// 			sold: this.seller.sold,
// 			type: this.seller.type,
// 		}
// 	}
// }

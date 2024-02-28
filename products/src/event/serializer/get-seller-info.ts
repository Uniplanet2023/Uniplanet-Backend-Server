import { BaseSerializeEvent } from "@uniplanet-lib/common"
import { UserDocument } from "../../models/user"
import { SellerRestPayload } from "./type-def"


export default class GetSellerInfo extends BaseSerializeEvent<SellerRestPayload> {
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
		}
	}
}

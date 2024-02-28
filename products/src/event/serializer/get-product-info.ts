import { BaseSerializeEvent } from "@uniplanet-lib/common"
import { ProductDocument } from "../../models/product"
import { GetProductRestPayload } from "./type-def"
import GetSellerInfo from "./get-seller-info"

export default class GetProductInfo extends BaseSerializeEvent<GetProductRestPayload> {
	private product: ProductDocument

	private statusCode = 201

	constructor(product: ProductDocument) {
		super()
		this.product = product
	}

	getStatusCode(): number {
		return this.statusCode
	}

	serializeRest(): GetProductRestPayload {
		return {
			id: this.product._id,
			productName: this.product.productName,
			status: this.product.status,
			seller: new GetSellerInfo(this.product.seller).serializeRest(),
			description: this.product.description,
			images: this.product.images,
			likes: this.product.likes,
			price: this.product.price,
			category: this.product.category,
			createdAt: this.product.createdAt,
		}
	}
}

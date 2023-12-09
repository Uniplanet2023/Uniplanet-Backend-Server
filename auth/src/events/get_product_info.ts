import { BaseAuthEvent } from './base_auth_event'
import { ProductDocument } from '../models'
import { GetProductRestPayload } from './type_def'
import { GetSellerInfo } from './index'

export default class GetProductInfo extends BaseAuthEvent<GetProductRestPayload> {
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
			forSale: this.product.forSale,
			seller: new GetSellerInfo(this.product.seller).serializeRest(),
			description: this.product.description,
			images: this.product.images,
			likes: this.product.likes,
			price: this.product.price,
			category: this.product.category,
		}
	}
}

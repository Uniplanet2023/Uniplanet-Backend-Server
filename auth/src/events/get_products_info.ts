import { BaseAuthEvent } from './base_auth_event'
import { ProductDocument } from '../models'
import { GetProductRestPayload } from './type_def'
import { GetProductInfo } from './index'

export default class GetProductsInfo extends BaseAuthEvent<GetProductRestPayload[]> {
	private products: ProductDocument[]

	private statusCode = 200

	constructor(products: ProductDocument[]) {
		super()
		this.products = products
	}

	getStatusCode(): number {
		return this.statusCode
	}

	serializeRest(): GetProductRestPayload[] {
		const productsInfo: GetProductRestPayload[] = []
		this.products.map(product => {
			productsInfo.push(new GetProductInfo(product).serializeRest())
		})
		return productsInfo
	}
}

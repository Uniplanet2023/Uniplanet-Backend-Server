import { BaseSerializeEvent } from "@uniplanet-lib/common"
import { GetProductRestPayload } from "./type-def"
import { ProductDocument } from "../../models/product"
import GetProductInfo from "./get-product-info"

export default class GetProductsInfo extends BaseSerializeEvent<GetProductRestPayload[]> {
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
		const productsInfo: GetProductRestPayload[] = this.products.map(product => {
			return new GetProductInfo(product).serializeRest();
		});
		return productsInfo;
	}
}

import { Model, Schema, model } from 'mongoose'
import { UserDocument } from './user'

export type ProductDocument = Document & {
	productName: string
	forSale: boolean
	seller: UserDocument
	description: string
	images: string[]
	price: number
	category: string
}

export type ProductModel = Model<ProductDocument>

const productSchema: Schema = new Schema(
	{
		productName: {
			type: String,
			required: true,
			trim: true,
			index: true,
		},
		status: {
			type: String,
			required: true,
			default: true,
		},
		seller: {
			type: Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
		description: {
			type: String,
			required: true,
			trim: true,
			default: '',
		},
		images: [
			{
				type: String,
				required: true,
			},
		],
		likes: {
			type: Number,
			default: 0,
		},
		price: {
			type: Number,
			required: true,
		},
		category: {
			type: String,
			required: true,
			index: true,
		},
		deletionDate: { type: Date, default: null },
	},
	{ timestamps: true },
)

productSchema.pre(/^.*([Ff]ind).*$/, function (this: any, next) {
	console.log(this.getQuery());
	const page = parseInt(this.getQuery().page as string) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;

	this.skip(skip).limit(10).sort({ createdAt: -1 })
	next()
})

const Product = model<ProductDocument, ProductModel>('Product', productSchema)
export default Product
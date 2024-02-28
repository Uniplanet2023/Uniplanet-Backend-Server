import { Model, Schema, model } from 'mongoose'
import { UserDocument } from './user'

export type ProductDocument = Document & {
	_id:string
	productName: string
	status: string
	seller: UserDocument
	description: string
	images: string[]
	likes: number
	price: number
	category: string
	createdAt: Date
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
			},
		],
		likes: {
			type: Number,
			default: 0,
		},
		price: {
			type: Number,
			required: true,
			default: 0,
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


const Product = model<ProductDocument, ProductModel>('Product', productSchema)
export default Product
import { Model, Schema, model, Document } from 'mongoose'
import { UserDocument, User } from './index'

export type ProductDocument = Document & {
	productName: string
	forSale: boolean
	seller: UserDocument
	description: string
	images: string[]
	likes: UserDocument[]
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
		forSale: {
			type: Boolean,
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
		likes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
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

productSchema.pre(/^.*([Ff]ind).*$/, function () {
	const pageNumber = parseInt(this.getQuery().page ?? 0, 10)
	const limit = 20
	const skip = pageNumber * limit
	this.skip(skip).limit(20).sort({ createdAt: -1 })
})

const Product = model<ProductDocument, ProductModel>('Product', productSchema)
export default Product

const changeStream = Product.watch()

changeStream.on('change', async change => {
	if (change.operationType === 'insert') {
		const productId = change.documentKey._id
		const sellerId = change.fullDocument.seller

		try {
			await User.updateOne({ _id: sellerId }, { $push: { selling: productId } })
			console.log(`Updated seller ${sellerId} with new product ${productId}`)
		} catch (error) {
			console.error(`Error updating seller ${sellerId}: ${error}`)
		}
	}
})

// Make sure to handle errors and close the change stream when the application is terminating
changeStream.on('error', error => {
	console.error('Error watching Product collection:', error)
	changeStream.close()
})

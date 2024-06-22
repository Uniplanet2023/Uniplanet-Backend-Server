import { model, Model, ObjectId, Schema } from 'mongoose'
import { Document } from 'mongoose'
import { AccountDocument } from './account'

export type AdvertiserDocument = Document & {
    account: AccountDocument
	maximumPost: number
	numberOfPost: number
	usedCredit: number
	givenCredit: number
    budget: number
    spent: number
	costPerClick: number
}

type AdvertiserAttrs = {
    account: ObjectId
	maximumPost?: number
	numberOfPost?: number
	usedCredit?: number
	givenCredit?: number
    budget?: number
    spent?: number
}
interface AdvertiserModel extends Model<AdvertiserDocument> {
	build(attrs: AdvertiserAttrs): AdvertiserDocument
}

const advertiserSchema: Schema = new Schema(
	{
        account: { type: Schema.Types.ObjectId, ref: 'Account' },
		maximumPost: { type: Number, default: 10},
		numberOfPost: { type: Number, default: 0 },
        costPerClick: { type: Number , default: 0.4},
		usedCredit: { type: Number, default: 0 },
		givenCredit: { type: Number, default: 0 },
		spent: { type: Number, default: 0 },
        budget: { type: Number, default: 0 },
	},
	{
		toJSON: {
			transform(ret) {
				ret.id = ret._id
				delete ret._id
				// eslint-disable-next-line no-underscore-dangle
				delete ret.__v
			},
		},
		timestamps: true,
	},
)

advertiserSchema.statics.build = (attrs: AdvertiserAttrs) => {
	//eslint-disable-next-line @typescript-eslint/no-use-before-define
	return new Advertiser(attrs)
}

const Advertiser = model<AdvertiserDocument, AdvertiserModel>('Advertiser', advertiserSchema)

export default Advertiser

import { model, Model, ObjectId, Schema } from 'mongoose'
import { Document } from 'mongoose'
import { AccountDocument } from './account'

export type AdvertiserDocument = Document & {
    account: AccountDocument
	maximumPost: number
	numberOfPost: number
	freeCreditUsed: number
	freeCredit: number
    credit: number
    creditUsed: number
	costPerClick: number
}

type AdvertiserAttrs = {
    account: ObjectId
	maximumPost?: number
	numberOfPost?: number
	freeCreditUsed?: number
	freeCredit?: number
    credit?: number
    creditUsed?: number
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
		freeCreditUsed: { type: Number, default: 0 },
		freeCredit: { type: Number, default: 0 },
		creditUsed: { type: Number, default: 0 },
        credit: { type: Number, default: 0 },
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

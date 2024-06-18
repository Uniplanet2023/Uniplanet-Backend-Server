import { model, Model, ObjectId, Schema } from 'mongoose'
import { Document } from 'mongoose'

export type AdInteractionDocument = Document & {
    account: ObjectId
    advertiser: ObjectId
    advertisement: string
}

type AdInteractionAttrs = {
    account: ObjectId
    advertiser: ObjectId
    advertisement: string
}
interface AdInteractionModel extends Model<AdInteractionDocument> {
	build(attrs: AdInteractionAttrs): AdInteractionDocument
}

const adInteractionSchema: Schema = new Schema(
	{
    account: { type: Schema.Types.ObjectId, ref: 'Account' },
    advertiser: { type: Schema.Types.ObjectId, ref: 'Advertiser' },
    advertisement: { type: String, required: true },
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

adInteractionSchema.statics.build = (attrs: AdInteractionAttrs) => {
	//eslint-disable-next-line @typescript-eslint/no-use-before-define
	return new AdInteraction(attrs)
}

const AdInteraction = model<AdInteractionDocument, AdInteractionModel>('AdInteraction', adInteractionSchema)

export default AdInteraction

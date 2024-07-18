import { model, Model, ObjectId, Schema } from 'mongoose'
import { Document } from 'mongoose'
import { AccountDocument } from './account'

export type AdInteractionDocument = Document & {
	account: AccountDocument
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
				delete ret.__v
			},
		},
		timestamps: true,
	},
)

adInteractionSchema.statics.build = (attrs: AdInteractionAttrs) => {
	return new AdInteraction(attrs)
}

const AdInteraction = model<AdInteractionDocument, AdInteractionModel>('AdInteraction', adInteractionSchema)

export default AdInteraction

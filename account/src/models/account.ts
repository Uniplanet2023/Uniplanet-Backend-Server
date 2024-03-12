import { model, Model, Schema } from 'mongoose'
import { Document } from 'mongoose'

export type AccountDocument = Document & {
	unreadNotification: number
	unreadMessage: number
	searchHistory: string[]
	recentViewHistory: string[]
	advertisementAgreement: boolean
}

type AccountAttrs = {
	_id: string
	unreadNotification?: number
	unreadMessage?: number
	searchHistory?: string[]
	recentViewHistory?: string[]
	advertisementAgreement?: boolean
}
//'https://res.cloudinary.com/dtgmmfv3d/image/upload/v1698359487/defaultImage/uj24px95hnrhydxobjl1.jpg'
interface AccountModel extends Model<AccountDocument> {
	build(attrs: AccountAttrs): AccountDocument
}

const accountSchema: Schema = new Schema(
	{
		_id: {
			type: String,
			required: true,
		},
		unreadNotification: {
			type: Number,
			default: 0,
		},
		unreadMessage: {
			type: Number,
			default: 0,
		},
		searchHistory: [{ type: String }],
		recentViewHistory: [{ type: Schema.Types.ObjectId }],
		advertisementAgreement: {
			type: Boolean,
			default: false,
		},
		deletionDate: { type: Date, default: null },
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

accountSchema.statics.build = (attrs: AccountAttrs) => {
	//eslint-disable-next-line @typescript-eslint/no-use-before-define
	return new Account(attrs)
}

const Account = model<AccountDocument, AccountModel>('Account', accountSchema)

export default Account

import { model, Model, Schema } from 'mongoose'
import { Document } from 'mongoose'

export type AccountDocument = Document & {
	_id: string
	name: string
	email: string
	profileImage: string
	school: string
	advertisementAgreement: boolean
	isNotificationAllowed: boolean
}

type AccountAttrs = {
	_id: string
	name: string
	email: string
	profileImage?: string
	school: string
	advertisementAgreement?: boolean
	isNotificationAllowed?: boolean
}
interface AccountModel extends Model<AccountDocument> {
	build(attrs: AccountAttrs): AccountDocument
}

const accountSchema: Schema = new Schema(
	{
		_id: {
			type: String,
			required: true,
		},
		name:{
			type: String,
			required: true,
		},
		email:{
			type: String,
			required: true,
		},
		profileImage:{
			type: String,
			required: false,
		},
		school:{
			type: String,
			required: true,
		},
		advertisementAgreement: {
			type: Boolean,
			default: true,
		},
		isNotificationAllowed:{
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

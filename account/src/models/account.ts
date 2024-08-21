import { model, Model, Schema } from 'mongoose'
import { Document } from 'mongoose'

export type AccountDocument = Document & {
	_id: string
	name: string
	email: string
	profileImage: string
	school: string
	deletionDate: Date
	isBlocked: boolean
	isBlockedPost: boolean
	isBlockedChat: boolean
	unSeenNotification: number
	numberOfReports: number
	status: string
	type: string
	subscription: string
	numberOfFreeItemClick: number
}

type AccountAttrs = {
	_id: string
	name: string
	email: string
	profileImage?: string
	school: string
	deletionDate?: Date
	isBlocked?: boolean
	isBlockedPost?: boolean
	isBlockedChat?: boolean
	unSeenNotification?: number
	type?: string
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
		name: {
			type: String,
			required: true,
		},
		email: {
			type: String,
			required: true,
		},
		profileImage: {
			type: String,
			required: false,
			default:
				'https://res.cloudinary.com/dtgmmfv3d/image/upload/f_auto,q_auto,c_fill,w_300,h_300/v1698359487/defaultImage/uj24px95hnrhydxobjl1.jpg',
		},
		school: {
			type: String,
			required: true,
		},
		type: {
			type: String,
			required: true,
			default: 'student', // student, local, admin, advertiser
		},
		unSeenNotification: {
			type: Number,
			default: 0,
		},
		numberOfReports: {
			type: Number,
			default: 0,
		},
		status: {
			type: String,
			default: 'active', // active, inactive
		},
		subscription:{
			type: String,
			default: 'free', // free, premium
		},
		numberOfFreeItemClick:{
			type: Number,
			default: 3,
		},
		deletionDate: { type: Date, default: null },
		isBlocked: { type: Boolean, default: false },
		isBlockedPost: { type: Boolean, default: false },
		isBlockedChat: { type: Boolean, default: false },
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

import { model, Model, Schema } from 'mongoose'
import { Document } from 'mongoose'

export type AccountDocument = Document & {
    name: string
    email: string
    school: string
    profileImage: string
	unreadNotification: number
    unreadMessage: number
    searchHistory: string[]
    recentViewHistory: string[]
    advertisementAgreement: boolean
}

type AccountAttrs = {
    name: string
    email: string
    school: string
    profileImage?: string
    unreadNotification?: number
    unreadMessage?: number
    searchHistory?: string[]
    recentViewHistory?: string[]
    advertisementAgreement?: boolean
}

interface AccountModel extends Model<AccountDocument> {
	build(attrs: AccountAttrs): AccountDocument
}

const accountSchema: Schema = new Schema(
	{
        name:{
            required: true,
            type: String,
            trim: true,
        },
        email: {
            required: true,
            type: String,
            trim: true,
            unique: true,
            index: true,
        },
        profileImage: {
            type: String,
            default: 'https://res.cloudinary.com/dtgmmfv3d/image/upload/v1698359487/defaultImage/uj24px95hnrhydxobjl1.jpg'
        },
        school:{
            required: true,
            type: String,
        },
        unreadNotification: {
            type: Number,
            default: 0,
        },
        unreadMessage: {
            type: Number,
            default: 0,
        },
        searchHistory: [{ type: String}],
		recentViewHistory: [{ type: Schema.Types.ObjectId}],
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

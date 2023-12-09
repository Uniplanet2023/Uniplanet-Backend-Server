import { model, Model, Schema, Document, UpdateQuery } from 'mongoose'
import { ProductDocument, UserChatRoomDocument, EventDocument } from './index'
import { DuplicatedEmail } from '../errors'
import { PasswordHash } from '../utils'

export type UserDocument = Document & {
	name: string
	email: string
	school: string
	verified: boolean
	password: string
	profileImage: string
	type: string
	recentSearchHistory: string[]
	recentViewHistory: ProductDocument[]
	like: ProductDocument[]
	myEvent: EventDocument[] // Assuming 'Event' schema exists
	selling: ProductDocument[]
	sold: ProductDocument[]
	bought: ProductDocument[]
	myChatRoom: UserChatRoomDocument[]
}
export type UserModel = Model<UserDocument>

const userSchema: Schema = new Schema(
	{
		name: {
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
		password: {
			required: true,
			type: String,
		},
		school: {
			required: true,
			type: String,
		},
		verified: {
			type: Boolean,
			default: false,
		},
		profileImage: {
			required: true,
			type: String,
		},
		type: {
			type: String,
			default: 'user',
		},
		recentSearchHistory: [{ type: String }],
		recentViewHistory: [{ type: Schema.Types.ObjectId, ref: 'Product' }],
		like: [{ type: Schema.Types.ObjectId, ref: 'Product' }],
		myEvent: [{ type: Schema.Types.ObjectId, ref: 'Event' }], // when you like save button
		selling: [{ type: Schema.Types.ObjectId, ref: 'Product' }],
		sold: [{ type: Schema.Types.ObjectId, ref: 'Product' }],
		bought: [{ type: Schema.Types.ObjectId, ref: 'Product' }],
		myChatRoom: [{ type: Schema.Types.ObjectId, ref: 'UserChatRoom' }],

		deletionDate: { type: Date, default: null },
	},
	{ timestamps: true },
)
async function validateUniqueness(userDoc: UserDocument) {
	// eslint-disable-next-line @typescript-eslint/no-use-before-define
	const existingUser = await User.findOne({ email: userDoc.email })

	if (existingUser) {
		throw new DuplicatedEmail()
	}
}

userSchema.pre('save', async function preValidateUniqueness(this: UserDocument) {
	await validateUniqueness(this)
})

userSchema.pre(/^.*([Uu]pdate).*$/, async function preValidateUniqueness(this: UpdateQuery<UserDocument>) {
	await validateUniqueness(this._update)
})

userSchema.pre('save', async function setVerifiedToFalseOnFirstSave(this: UserDocument) {
	// eslint-disable-next-line @typescript-eslint/no-use-before-define
	const existingUser = await User.findOne({ email: this.email })

	if (!existingUser) {
		this.set('verified', false)
	}
})

userSchema.pre('save', function preHashPassword(this: UserDocument) {
	const newPassword = this.isModified('password') ? this.get('password') : null

	if (newPassword) {
		this.set(
			'password',
			PasswordHash.toHashSync({
				password: newPassword,
			}),
		)
	}
})

userSchema.pre(/^.*([Uu]pdate).*$/, async function preHashPassword(this: UpdateQuery<UserDocument>) {
	const newPassword = !!this._update.password ? this._update.password : null
	if (newPassword) {
		this._update.password = PasswordHash.toHashSync({
			password: newPassword,
		})
	}
})
const User = model<UserDocument, UserModel>('User', userSchema)
export default User

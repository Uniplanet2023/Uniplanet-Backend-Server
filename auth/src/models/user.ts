import { model, Model, Schema, UpdateQuery } from 'mongoose'
import { PasswordHash, DuplicatedEmail, UserDocument } from '@uniplanet-lib/common'
import { updateIfCurrentPlugin } from 'mongoose-update-if-current'

type UserAttrs = {
	name: string
	email: string
	school: string
	password: string
	profileImage: string
	verified?: boolean
	type?: string
}

interface UserModel extends Model<UserDocument> {
	build(attrs: UserAttrs): UserDocument
}

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
	{
		toJSON: {
			transform(doc, ret) {
				ret.id = ret._id
				delete ret._id
				delete ret.password
				delete ret.__v
			},
		},
		timestamps: true,
	},
)
userSchema.set('versionKey', 'version')
userSchema.plugin(updateIfCurrentPlugin)

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

userSchema.statics.build = (attrs: UserAttrs) => {
	console.log(attrs)
	return new User(attrs)
}

const User = model<UserDocument, UserModel>('User', userSchema)

export default User

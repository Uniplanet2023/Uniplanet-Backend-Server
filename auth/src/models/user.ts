import { model, Model, Schema, UpdateQuery } from 'mongoose'
import { PasswordHash, DuplicatedEmail } from '@uniplanet-lib/common'
import { updateIfCurrentPlugin } from 'mongoose-update-if-current'
import { Document } from 'mongoose'

export type UserDocument = Document & {
	email: string
	school: string
	verified: boolean
	password: string
	type: string
	deletionDate?: Date
}

type UserAttrs = {
	email: string
	school: string
	password: string
	verified?: boolean
	type?: string
}

interface UserModel extends Model<UserDocument> {
	build(attrs: UserAttrs): UserDocument
}

const userSchema: Schema = new Schema(
	{
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
		type: {
			type: String,
			default: 'user',
		},
		verified: {
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
				delete ret.password
				// eslint-disable-next-line no-underscore-dangle
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
	//eslint-disable-next-line @typescript-eslint/no-use-before-define
	return new User(attrs)
}

const User = model<UserDocument, UserModel>('User', userSchema)

export default User

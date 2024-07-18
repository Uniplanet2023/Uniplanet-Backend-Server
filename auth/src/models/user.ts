import { model, Model, Schema, UpdateQuery } from 'mongoose'
import { PasswordHash, DuplicatedEmail } from '@uniplanet-lib/common'
import { updateIfCurrentPlugin } from 'mongoose-update-if-current'
import { Document } from 'mongoose'

export type UserDocument = Document & {
	name: string
	profileImage: string
	email: string
	school: string
	verified: boolean
	password: string
	type: string
	phoneNumber: string
	deletionDate?: Date
}

type UserAttrs = {
	name: string
	email: string
	school: string
	password: string
	verified?: boolean
	type?: string
	phoneNumber?: string
	deletionDate?: Date
}

interface UserModel extends Model<UserDocument> {
	build(attrs: UserAttrs): UserDocument
}

const userSchema: Schema = new Schema(
	{
		//temp name
		name: {
			type: String,
			trim: true,
			required: true,
		},
		//temp profileImage
		profileImage: {
			type: String,
			default:
				'https://res.cloudinary.com/dtgmmfv3d/image/upload/f_auto,q_auto,c_fill,w_300,h_300/v1698359487/defaultImage/uj24px95hnrhydxobjl1.jpg',
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
		type: {
			type: String,
			required: true,
		},
		verified: {
			type: Boolean,
			default: false,
		},
		deletionDate: { type: Date, default: null },
		phoneNumber: {
			type: String,
			required: true,
		},
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

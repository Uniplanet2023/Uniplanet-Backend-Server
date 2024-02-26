import { model, Model, Schema, UpdateQuery } from 'mongoose'
import { PasswordHash, DuplicatedEmail } from '@uniplanet-lib/common'
import { updateIfCurrentPlugin } from 'mongoose-update-if-current'
import { Document } from 'mongoose'

export type UserDocument = Document & {
	name: string
	email: string
	school: string
	profileImage: string
}

type UserAttrs = {
	name: string
	email: string
	school: string
	profileImage: string
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
		school: {
			required: true,
			type: String,
		},
		profileImage: {
			required: true,
			type: String,
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


userSchema.statics.build = (attrs: UserAttrs) => {
	//eslint-disable-next-line @typescript-eslint/no-use-before-define
	return new User(attrs)
}

const User = model<UserDocument, UserModel>('User', userSchema)

export default User

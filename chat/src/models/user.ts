import { model, Model, Schema } from 'mongoose'
import { updateIfCurrentPlugin } from 'mongoose-update-if-current'
import { Document } from 'mongoose'

export type UserDocument = Document & {
	_id: string
	name: string
	email: string
	school: string
	profileImage: string
}

type UserAttrs = {
	_id: string
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
				delete ret.deletionDate
				delete ret.createdAt
				delete ret.updatedAt
				delete ret.version
				// eslint-disable-next-line no-underscore-dangle
				delete ret.__v
			},
		},
		timestamps: true,
	},
)
userSchema.set('versionKey', 'version')
userSchema.plugin(updateIfCurrentPlugin)

userSchema.statics.build = (attrs: UserAttrs) => {
	//eslint-disable-next-line @typescript-eslint/no-use-before-define
	return new User(attrs)
}

const User = model<UserDocument, UserModel>('User', userSchema)

export default User

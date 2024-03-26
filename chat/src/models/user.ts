import { Document } from 'mongoose'
import { model, Model, Schema } from 'mongoose'

export type UserDocument = Document & {
	_id: string
	name: string
	email: string
	profileImage: string
	school: string
}

type UserAttrs = {
	id: string
	name: string
	email: string
	profileImage: string
	school: string
}
//'https://res.cloudinary.com/dtgmmfv3d/image/upload/v1698359487/defaultImage/uj24px95hnrhydxobjl1.jpg'
interface UserModel extends Model<UserDocument> {
	build(attrs: UserAttrs): UserDocument
}

const userSchema: Schema = new Schema(
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
			required: true,
		},
		school: {
			type: String,
			required: true,
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

userSchema.statics.build = (attrs: UserAttrs) => {
	//eslint-disable-next-line @typescript-eslint/no-use-before-define
	const user = new User({
		_id: attrs.id,
		name: attrs.name,
		email: attrs.email,
		profileImage: attrs.profileImage,
		school: attrs.school,
	
	})
	return user
}

const User = model<UserDocument, UserModel>('User', userSchema)

export default User

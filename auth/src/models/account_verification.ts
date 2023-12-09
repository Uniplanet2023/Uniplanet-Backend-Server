import { model, Model, Schema, Document } from 'mongoose'
import { User, UserDocument } from './index'
import { generateEmailVerificationToken } from '../utils/account_verification'

export type AccountVerificationDocument = Document & {
	userId: UserDocument
	emailVerificationToken: string
}
export type AccountVerificationModel = Model<AccountVerificationDocument>

const accountVerificationSchema: Schema = new Schema(
	{
		userId: {
			type: Schema.Types.ObjectId,
			required: true,
		},
		emailVerificationToken: {
			type: String,
			required: true,
			validate: (value: string): boolean => {
				if (!value || value.length !== 64) {
					throw new Error('Invalid email verification token')
				}
				return true
			},
		},
	},
	{ timestamps: true },
)

accountVerificationSchema.pre('save', async function verifyUserExists(this: AccountVerificationDocument) {
	const user = await User.findById(this.userId)
	if (!user) {
		throw new Error('User could not be found')
	}
})

accountVerificationSchema.pre('save', async function enforceTokenUniqueness(this: AccountVerificationDocument) {
	// eslint-disable-next-line @typescript-eslint/no-use-before-define
	let existingEmailVerificationDocument = await AccountVerification.findOne({
		emailVerificationToken: this.emailVerificationToken,
	})

	while (existingEmailVerificationDocument) {
		this.emailVerificationToken = generateEmailVerificationToken()
		// eslint-disable-next-line @typescript-eslint/no-use-before-define
		existingEmailVerificationDocument = await AccountVerification.findOne({
			emailVerificationToken: this.emailVerificationToken,
		})
	}
})
const AccountVerification = model<AccountVerificationDocument, AccountVerificationModel>(
	'AccountVerification',
	accountVerificationSchema,
)
export default AccountVerification

import mongoose from 'mongoose'
import { generateEmailVerificationToken } from '../../utils/account_verification'
import { AccountVerification, User } from '../index'
let validUserInfo = {
	email: '',
	profileImage: '',
	school: '',
	verified: false,
	name: '',
	password: '',
}
describe('tests the AccountVerification mongoose model', () => {
	beforeAll(() => {
		validUserInfo = {
			email: 'test1@stonybrook.edu',
			profileImage:
				'https://res.cloudinary.com/dtgmmfv3d/image/upload/v1698359487/defaultImage/uj24px95hnrhydxobjl1.jpg',
			school: 'Stony Brook University',
			verified: true,
			name: 'sije',
			password: 'TestPassword1!',
		}
	})
	it('should not save a new AccountVerification document if no valid user is provided ', async () => {
		const emailVerificationToken = generateEmailVerificationToken()

		await expect(
			AccountVerification.create({
				userId: new mongoose.Types.ObjectId(),
				emailVerificationToken,
			}),
		).rejects.toThrow('User could not be found')
	})
	it('should not save a new AccountVerification document if the token is invalid', async () => {
		const newUser = await User.create(validUserInfo)

		await expect(
			AccountVerification.create({
				userId: newUser.id,
				emailVerificationToken: 'notvalid',
			}),
		).rejects.toThrow('Invalid email verification token')
	})
	it('should ensure the uniqueness of the email verification token', async () => {
		const emailVerificationToken = generateEmailVerificationToken()

		const newUser = await User.create(validUserInfo)

		await AccountVerification.create({
			userId: newUser.id,
			emailVerificationToken,
		})

		const secondAccountVerification = await AccountVerification.create({
			userId: newUser.id,
			emailVerificationToken,
		})

		expect(secondAccountVerification.emailVerificationToken).not.toEqual(emailVerificationToken)
	})
})

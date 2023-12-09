import { randomBytes } from 'crypto'
import { User, UserDocument } from '../index'
import { BaseCustomError, DuplicatedEmail } from '../../errors'
import { PasswordHash } from '../../utils'
let validUserInfo = {
	email: '',
	profileImage: '',
	school: '',
	verified: false,
	name: '',
	password: '',
}
describe('tests the User mongoose model', () => {
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

	it('should not save a user if the email is already in the database', async () => {
		const newUser1 = await User.create(validUserInfo)
		expect(newUser1).toBeDefined()
		expect(newUser1.email).toEqual(validUserInfo.email)
		let err
		try {
			await User.create(validUserInfo) // Error
		} catch (e) {
			err = e as DuplicatedEmail
		}
		const serializedErrorOutput = err ? err.serializeErrorOutput() : undefined

		expect(err).toBeDefined()
		expect(err).toBeInstanceOf(BaseCustomError)
		expect(serializedErrorOutput).toBeDefined()
		expect(serializedErrorOutput?.errors[0].message).toEqual('The email is already in the database')
	})

	it("should not update an existing user's email if the new email is already in the database", async () => {
		await User.create(validUserInfo)
		validUserInfo.email = 'test2@stonybrook.edu'
		const newUser2 = await User.create(validUserInfo)

		let err: DuplicatedEmail | undefined

		try {
			await User.findOneAndUpdate({ _id: newUser2._id }, { email: 'test1@stonybrook.edu' }, { new: true })
		} catch (e) {
			err = e as DuplicatedEmail
		}

		const serializedErrorOutput = err ? err.serializeErrorOutput() : undefined

		expect(err).toBeDefined()
		expect(err).toBeInstanceOf(BaseCustomError)
		expect(serializedErrorOutput).toBeDefined()
		expect(serializedErrorOutput?.errors[0].message).toEqual('The email is already in the database')
	})

	it('should encrypt the password when creating the user', async () => {
		const newUser = await User.create(validUserInfo)
		expect(newUser.password).not.toEqual(validUserInfo.password)
		expect(newUser.password.split('.')).toHaveLength(2)
		expect(newUser.password.split('.')[1].length).toEqual(randomBytes(16).toString('hex').length)
	})
	it('should encrypt the password when the user updates the password', async () => {
		let newUser: UserDocument | undefined = await User.create(validUserInfo)

		newUser = (await User.findOneAndUpdate(
			{
				_id: newUser._id,
			},
			{ password: 'Newvalid123!' },
			{ new: true },
		)) as UserDocument

		expect(newUser.password).not.toEqual('Newvalid123!')
		expect(newUser.password.split('.')).toHaveLength(2)
		expect(newUser.password.split('.')[1].length).toEqual(randomBytes(16).toString('hex').length)
	})

	it('should return true when comparing the hashedPassword with its original providedPassword', async () => {
		const newUser = await User.create(validUserInfo)

		expect(
			PasswordHash.compareSync({
				providedPassword: '1234',
				storedPassword: newUser.password,
			}),
		).toEqual(false)
		expect(
			PasswordHash.compareSync({
				providedPassword: validUserInfo.password,
				storedPassword: newUser.password,
			}),
		).toEqual(true)
	})
	it('should set verified to false when the value is not provided', async () => {
		const newUser = await User.create(validUserInfo)

		expect(newUser.verified).toBeFalsy()
	})
	it('should set verified to false on first save, even if the provided value is set to true', async () => {
		validUserInfo.verified = true
		const newUser = await User.create(validUserInfo)

		expect(newUser.verified).toEqual(false)
	})
	it('should allow to change verified to true if the user already exists', async () => {
		const newUser = await User.create(validUserInfo)

		const updatedUser = await User.findOneAndUpdate({ _id: newUser._id }, { verified: true }, { new: true })
		expect(updatedUser).toBeDefined()
		expect(updatedUser!.verified).toEqual(true)
	})
})

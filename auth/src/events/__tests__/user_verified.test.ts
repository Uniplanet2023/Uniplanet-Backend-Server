import { User } from '../../models'
import UserVerified from '../user_verified'

let validUserInfo = {
	email: '',
	profileImage: '',
	school: '',
	verified: false,
	name: '',
	password: '',
}
beforeAll(() => {
	validUserInfo = {
		email: 'test1@stonybrook.edu',
		profileImage: 'https://res.cloudinary.com/dtgmmfv3d/image/upload/v1698359487/defaultImage/uj24px95hnrhydxobjl1.jpg',
		school: 'Stony Brook University',
		verified: true,
		name: 'sije',
		password: 'TestPassword1!',
	}
})

it('should expose only the id when serializing to REST', async () => {
	const user = await User.create(validUserInfo)

	const userVerifiedEvent = new UserVerified(user)
	const serializedResponse = userVerifiedEvent.serializeRest()

	expect(Object.keys(serializedResponse)).toEqual(['id', 'verificationStatus'])
	expect(userVerifiedEvent.getStatusCode()).toEqual(200)
})

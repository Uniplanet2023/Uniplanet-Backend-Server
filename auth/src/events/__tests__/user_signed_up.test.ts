import { User } from '../../models'
import { GetUserInfo } from '../index'

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

it('should expose only the id and the email when serializing to REST', async () => {
	const newUser = await User.create(validUserInfo)
	const userSignedUpEvent = new GetUserInfo(newUser)
	const serializedResponse = userSignedUpEvent.serializeRest()

	expect(Object.keys(serializedResponse).sort()).toEqual(
		[
			'id',
			'email',
			'bought',
			'like',
			'myChatRoom',
			'myEvent',
			'name',
			'profileImage',
			'recentSearchHistory',
			'recentViewHistory',
			'school',
			'selling',
			'sold',
			'type',
			'verified',
		].sort(),
	)
	expect(serializedResponse.email).toEqual(validUserInfo.email)
	expect(userSignedUpEvent.getStatusCode()).toEqual(201)
})

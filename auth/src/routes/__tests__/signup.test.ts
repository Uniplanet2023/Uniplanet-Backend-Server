import request from 'supertest'
import app from '../../app'
import { SIGNUP_ROUTE } from '../route_defs'
import { User } from '../../models/index'
import { EmailSender } from '../../utils'
import { MockEmailApi, mockSendSignUpVerificationEmail } from '../../test_util/mock_email_api'
beforeEach(() => {
	const emailSender = EmailSender.getInstance()

	emailSender.activate()
	emailSender.setEmailApi(new MockEmailApi())
	jest.clearAllMocks()
})

/**
 * Valid email conditions:
 *  - Standard email formats form 'express-validator' package
 */

let validUserInfo = {
	email: '',
	profileImage: '',
	school: '',
	verified: true,
	name: '',
	password: '',
}
describe('test Validify of email input', () => {
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
	it('should return 422 if there is no super domain', async () => {
		validUserInfo.email = 'emailTest@stonybrook.'
		await request(app).post(SIGNUP_ROUTE).send(validUserInfo).expect(422)
	})
	it('should return 422 if there is no dot', async () => {
		validUserInfo.email = 'emailTest@stonybrook'
		await request(app).post(SIGNUP_ROUTE).send(validUserInfo).expect(422)
	})
	it('should return 422 if there is no subdomain', async () => {
		validUserInfo.email = 'emailTest@.edu'
		await request(app).post(SIGNUP_ROUTE).send(validUserInfo).expect(422)
	})
	it('should return 422 if there is no at', async () => {
		validUserInfo.email = 'emailTeststonybrook.edu'
		await request(app).post(SIGNUP_ROUTE).send(validUserInfo).expect(422)
	})
	it('should return 422 if there is no user name', async () => {
		validUserInfo.email = '@stonybrook.edu'
		await request(app).post(SIGNUP_ROUTE).send(validUserInfo).expect(422)
	})
	it('should return 422 if sub-domain is capital', async () => {
		validUserInfo.email = 'emailTest@STONYBROOK.edu'
		await request(app).post(SIGNUP_ROUTE).send(validUserInfo).expect(422)
	})

	it('should return 201 if the email is valid', async () => {
		validUserInfo.email = 'emailTest@stonybrook.edu'
		await request(app).post(SIGNUP_ROUTE).send(validUserInfo).expect(201)
	})
})

/**
 * Valid password conditions:
 * 	- At least 8 characters
 *  - One lower-case letter
 *  - On uppper-case letter
 *  - One special letter
 *  - One number
 *
 */
describe('test validity of password input', () => {
	beforeAll(() => {
		validUserInfo = {
			email: 'test1@stonybrook.edu',
			profileImage:
				'https://res.cloudinary.edu/dtgmmfv3d/image/upload/v1698359487/defaultImage/uj24px95hnrhydxobjl1.jpg',
			school: 'Stony Brook University',
			verified: true,
			name: 'sije',
			password: 'TestPassword1!',
		}
	})
	it('should return 422 if the password contains less than 8 characters', async () => {
		validUserInfo.password = 'Test1!'
		await request(app).post(SIGNUP_ROUTE).send(validUserInfo).expect(422)
	})
	it('should return 422 if the password does not contain one lower-case letter', async () => {
		validUserInfo.password = 'TESTPASSWORD1!'
		await request(app).post(SIGNUP_ROUTE).send(validUserInfo).expect(422)
	})
	it('should return 422 if the password does not contain one upper-case letter', async () => {
		validUserInfo.password = 'testpassword1!'
		await request(app).post(SIGNUP_ROUTE).send(validUserInfo).expect(422)
	})
	it('should return 422 if the password does not contain one special charator', async () => {
		validUserInfo.password = 'testpassword11'
		await request(app).post(SIGNUP_ROUTE).send(validUserInfo).expect(422)
	})

	it('should return 422 if the password does not contain a number', async () => {
		validUserInfo.password = 'testpassword!!'
		await request(app).post(SIGNUP_ROUTE).send(validUserInfo).expect(422)
	})
	it('should return 201 if the password is valid', async () => {
		validUserInfo.password = 'TestPassword1!'
		await request(app).post(SIGNUP_ROUTE).send(validUserInfo).expect(201)
	})
})

describe('tests saving the signed up user to the database', () => {
	beforeAll(() => {
		validUserInfo = {
			email: 'test1@stonybrook.edu',
			profileImage:
				'https://res.cloudinary.edu/dtgmmfv3d/image/upload/v1698359487/defaultImage/uj24px95hnrhydxobjl1.jpg',
			school: 'Stony Brook University',
			verified: true,
			name: 'sije',
			password: 'TestPassword1!',
		}
	})
	it('saves the user successfully as long as the information is valid', async () => {
		// Send valid user information
		// Receive the user information back from the route
		// Check whether I can find the user in the databse by using the _id or email property
		const response = await request(app).post(SIGNUP_ROUTE).send(validUserInfo).expect(201)
		const user = await User.findOne({ email: response.body.email })
		const userEmail = user ? user.email.toLocaleLowerCase() : ''

		expect(user).toBeDefined()
		expect(userEmail).toEqual(validUserInfo.email.toLocaleLowerCase())
	})
	it('does not allow saving a user with a duplicate email', async () => {
		// Send valid user information
		// Send valid user information again( the sam info)
		// Should return the respective HTTP error code
		await request(app).post(SIGNUP_ROUTE).send(validUserInfo).expect(201)
		await User.findOneAndUpdate({ email: validUserInfo.email }, { verified: true })
		await request(app).post(SIGNUP_ROUTE).send(validUserInfo).expect(422)
		// expect(response.body.errors[0].message).toEqual('The email is already in the database');
	})

	it('should not include the user password on the response', async () => {
		const response = await request(app).post(SIGNUP_ROUTE).send(validUserInfo).expect(201)
		expect(response.body.password).toBeUndefined()
	})
	it('encrypts the user password when saving the user to the database', async () => {
		const response = await request(app).post(SIGNUP_ROUTE).send(validUserInfo).expect(201)

		const newUser = await User.findOne({ email: response.body.email })
		const newUserPassword = newUser ? newUser.password : ''

		expect(newUserPassword.length).toBeGreaterThan(0)
		expect(newUserPassword).not.toEqual(validUserInfo.password)
	})
})

describe('tests the email verification behavior on signup', () => {
	beforeAll(() => {
		validUserInfo = {
			email: 'test1@stonybrook.edu',
			profileImage:
				'https://res.cloudinary.edu/dtgmmfv3d/image/upload/v1698359487/defaultImage/uj24px95hnrhydxobjl1.jpg',
			school: 'Stony Brook University',
			verified: true,
			name: 'sije',
			password: 'TestPassword1!',
		}
	})
	it('triggers the sendSignUpVerificationEmail method from the EmailSender class', async () => {
		await request(app).post(SIGNUP_ROUTE).send(validUserInfo).expect(201)
		expect(mockSendSignUpVerificationEmail).toHaveBeenCalledTimes(1)
	})
})

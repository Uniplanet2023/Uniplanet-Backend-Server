import express, { Request, Response } from 'express'
import { User } from '../models'
import { SIGNUP_ROUTE } from './routes-def'
import {
	emailValidation,
	nameValidation,
	passwordValidation,
	schoolValidation,
	DuplicatedEmail,
	validateRequest,
	userTypeValidation,
	phoneNumberValidation,
} from '@uniplanet-lib/common'
import { sendVerificationEmail } from '../utils/send-verification-email'

const signUpRouter = express.Router()

signUpRouter.post(
	SIGNUP_ROUTE,
	[
		...emailValidation,
		nameValidation,
		schoolValidation,
		...passwordValidation,
		userTypeValidation,
		phoneNumberValidation,
	],
	validateRequest,
	async (req: Request, res: Response) => {
		const { name, email, password, school, userType, phoneNumber } = req.body

		const existingUser = await User.findOne({ email })
		if(userType === 'student'){
			// check if the email is end with .edu email
			if(!email.endsWith('.edu')){
				return res.status(400).json({ msg: 'Student email must end with .edu' })
			}

		}
		if (existingUser) {
			if (existingUser.verified) {
				throw new DuplicatedEmail()
			}

			await existingUser.updateOne({ password, school })
			// User exists but not verified, resend verification email
			if (process.env.SMTP_HOST === 'kubernetes-env') {
				// Create and save new user
				return res.status(201).json({ existingUser })
			} else {
				const hash = await sendVerificationEmail(existingUser.email)
				return res.status(201).json({ hash })
			}
		}

		// Determine the user type based on the email suffix
		const newUser = User.build({ name, email, password, school, type: userType, phoneNumber, deletionDate: new Date() })
		await newUser.save()

		if (process.env.SMTP_HOST === 'kubernetes-env') {
			return res.status(201).json({ newUser })
		} else {
			// Send verification email to new user
			const hash = await sendVerificationEmail(newUser.email)
			// const userSignedUp = new UserSerializer(newUser)
			return res.status(201).json({ hash })
		}
	},
)

export default signUpRouter

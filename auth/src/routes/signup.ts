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
} from '@uniplanet-lib/common'
import { sendVerificationEmail } from '../utils/send-verification-email'


const signUpRouter = express.Router()

signUpRouter.post(
	SIGNUP_ROUTE,
	[...emailValidation, nameValidation, schoolValidation, ...passwordValidation],
	validateRequest,
	async (req: Request, res: Response) => {
		const { name, email, password, school, profileImage } = req.body
		const existingUser = await User.findOne({ email })
		const userType = email.endsWith('.edu') ? 'user' : 'visitor'
		if (existingUser) {
			if (existingUser.verified) {
				throw new DuplicatedEmail()
			}
			if (userType === 'visitor') {
				return res
					.status(404)
					.send({ error: 'Please use your school email to sign up. Or Contact with Admin for more information.' })
			}
			await existingUser.updateOne({ password, school })
			// User exists but not verified, resend verification email
			if (process.env.SMTP_HOST === 'kubernetes-env') {
				// Create and save new user
				return res.status(201).json({ existingUser })
			} else {
				const { hash } = await sendVerificationEmail(existingUser.email)
				return res.status(201).json({ hash })
			}
		}

		// Determine the user type based on the email suffix

		const newUser = User.build({ name, email, password, school, type: userType, deletionDate: new Date()})
		await newUser.save()
		if (userType === 'visitor') {
			return res
				.status(404)
				.send({ error: 'Please use your school email to sign up. Or Contact with Admin for more information.' })
		}
		if (process.env.SMTP_HOST === 'kubernetes-env') {
			return res.status(201).json({ newUser })
		} else {
			// Send verification email to new user
			const { hash } = await sendVerificationEmail(newUser.email)
			// const userSignedUp = new UserSerializer(newUser)
			return res.status(201).json({ hash })
		}
	},
)

export default signUpRouter

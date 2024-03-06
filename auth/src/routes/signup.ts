import express, { Request, Response } from 'express'
import { User } from '../models'
import UserSerializer from '../events/serializer/UserSerializer'
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
import { UserCreatedProducer } from '../events'
import { kafkaClient } from '../kafka-client'
import { userProducer } from '..'

const signUpRouter = express.Router()

signUpRouter.post(
	SIGNUP_ROUTE,
	[...emailValidation, nameValidation, schoolValidation, ...passwordValidation],
	validateRequest,
	async (req: Request, res: Response) => {
		const { name, email, password, school } = req.body
		const existingUser = await User.findOne({ email })

		if (existingUser) {
			if (existingUser.verified) {
				throw new DuplicatedEmail()
			}
			// User exists but not verified, resend verification email
			if (process.env.SMTP_HOST === 'kubernetes-env') {
				// Create and save new user
				return res.status(201).json({ existingUser })
			}
			const { hash } = await sendVerificationEmail(existingUser.name, existingUser.email)
			const userSerialized = new UserSerializer(existingUser)
			return res.status(userSerialized.getStatusCode()).json({ hash, ...userSerialized.serializeRest() })
		}
		const newUser = User.build({ email, password, name, school })
		await newUser.save()
		console.log('sending message');
		userProducer.sendMessage({
			id: newUser.id,
			name: newUser.name,
			email: newUser.email,
			school: newUser.school,
		});
		if (process.env.SMTP_HOST === 'kubernetes-env') {
			// Create and save new user
			return res.status(201).json({ newUser })
		} else {
			// Send verification email to new user
			const { hash } = await sendVerificationEmail(newUser.name, newUser.email)
			// const userSignedUp = new UserSerializer(newUser)
			return res.status(201).json({ hash })
		}
	},
)

export default signUpRouter

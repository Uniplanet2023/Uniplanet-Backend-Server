import express, { Request, Response } from 'express'
import { User } from '../models/index'
import {
	validateRequest,
	PasswordHash,
	emailValidation,
	passwordValidation,
	UserNotFoundError,
	PasswordMismatchError,
	VerificationRequiredError,
} from '@uniplanet-lib/common'
import { SIGNIN_ROUTE } from './routes-def'
import { generateToken } from '../utils/enforce-token-unique'
import UserSerializer from '../events/serializer/UserSerializer'
import { userRestoreProducer } from '..'

const signInRouter = express.Router()
signInRouter.post(
	SIGNIN_ROUTE,
	[...emailValidation, ...passwordValidation],
	validateRequest,
	async (req: Request, res: Response) => {
		const { email, password } = req.body

		const user = await User.findOne({ email })

		// Check if user exists
		if (!user) throw new UserNotFoundError()
		if (!user.verified) throw new VerificationRequiredError()

		// Compare passwords
		const isMatch = PasswordHash.compareSync({ providedPassword: password, storedPassword: user.password })
		if (!isMatch) throw new PasswordMismatchError()

		// Generate JWT
		const userJwt = await generateToken(user)
		if (user.deletionDate) {
			await User.findByIdAndUpdate(
				{ _id: user.id },
				{ deletionDate: null },
				{ new: true },
			)
			userRestoreProducer.sendMessage({
				id: user.id,
				deletionDate: undefined,
			})
		}

		// Store it on session object
		req.session = { jwt: userJwt }
		const userInfo = new UserSerializer(user)
		res.status(userInfo.getStatusCode()).send(userInfo.serializeRest())
		
		  
	},
)

export default signInRouter

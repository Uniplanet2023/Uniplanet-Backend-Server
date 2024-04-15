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
import { enforceTokenUniqueness } from '../utils/enforce-token-unique'
import UserSerializer from '../events/serializer/UserSerializer'

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
		if(user.deletionDate != undefined) {
			user.deletionDate = undefined;
			await user.save();
		}
		
		// Compare passwords
		const isMatch = PasswordHash.compareSync({ providedPassword: password, storedPassword: user.password })
		if (!isMatch) throw new PasswordMismatchError()

		// Generate JWT
		const userJwt = await enforceTokenUniqueness(user)

		// Store it on session object
		req.session = { jwt: userJwt }
		const userInfo = new UserSerializer(user);
	return res.status(userInfo.getStatusCode()).send(userInfo.serializeRest());
	},
)

export default signInRouter

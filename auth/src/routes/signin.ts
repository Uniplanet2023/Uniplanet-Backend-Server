import express, { Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { User } from '../models/index'
import { validateRequest, PasswordHash, emailValidation, passwordValidation } from '@uniplanet-lib/common'
import { SIGNIN_ROUTE } from './routes-def'
import UserSerializer from '../events/serializer/UserSerializer'

const signInRouter = express.Router()
signInRouter.post(
	SIGNIN_ROUTE,
	[...emailValidation, ...passwordValidation],
	validateRequest,
	async (req: Request, res: Response) => {
		const { email, password } = req.body

		const user = await User.findOne({ email })
		if (!user || !user.verified) throw new Error('Invalid Credential')

		const isMatch = PasswordHash.compareSync({ providedPassword: password, storedPassword: user.password })
		if (!isMatch) throw new Error('Invalid Credential')
		// Generate JWT
		const userJwt = jwt.sign(JSON.stringify({
			id:user.id,
			email: user.email,
			profileImage: user.profileImage,
			school: user.school,
			verified:user.verified
		}),process.env.JWT_TOKEN_SECRET!,{
			issuer: 'UniPlanet',
			subject: 'userInfo',
		});
		// Store it on session object
		req.session = {
			jwt: userJwt
		};
		const currentUser = new UserSerializer(user)
		res.status(currentUser.getStatusCode()).send(currentUser.serializeRest())
	},
)

export default signInRouter

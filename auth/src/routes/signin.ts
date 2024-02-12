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

		const token = jwt.sign(user.toJSON(), process.env.JWT_TOKEN_SECRET as string, {
			expiresIn: '10d',
			issuer: 'UniPlanet',
			subject: 'userInfo',
		})

		req.session = { jwt: token }
		const currentUser = new UserSerializer(user)
		res.status(currentUser.getStatusCode()).send(currentUser.serializeRest())
	},
)

export default signInRouter

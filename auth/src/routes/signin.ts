import express, { Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { User } from '../models/index'
import { GetUserInfo, validateRequest, PasswordHash, emailValidation, passwordValidation } from '@uniplanet-lib/common'
import { SIGNIN_ROUTE, TOKEN_IS_VALID_ROUTE } from './routes_def'

const signInRoute = express.Router()
signInRoute.post(
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
		const currentUser = new GetUserInfo(user)
		res.status(currentUser.getStatusCode()).send(currentUser.serializeRest())
	},
)

export default signInRoute

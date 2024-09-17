import express, { Request, Response } from 'express'
import { UserNotFoundError, VerificationRequiredError, tokenValidation } from '@uniplanet-lib/common'
import { TOKEN_LOGIN_ROUTE } from './routes-def'
import { User } from '../models'
import UserSerializer from '../events/serializer/UserSerializer'
import { generateToken } from '../utils/enforce-token-unique'

const tokenLoginRouter = express.Router()
tokenLoginRouter.post(TOKEN_LOGIN_ROUTE, tokenValidation, async (req: Request, res: Response) => {
	const user = await User.findById(req.user!.id)
	console.log('user', user)
	if (!user) throw new UserNotFoundError()
	if (!user.verified) throw new VerificationRequiredError()
	const userJwt = await generateToken(user)
	// Store it on session object
	req.session = { jwt: userJwt }
	const userInfo = new UserSerializer(user)
	return res.status(userInfo.getStatusCode()).send(userInfo.serializeRest())
})

export default tokenLoginRouter

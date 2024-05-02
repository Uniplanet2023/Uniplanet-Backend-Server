import express, { Request, Response } from 'express'
import { UserNotFoundError, VerificationRequiredError, tokenValidation } from '@uniplanet-lib/common'
import { TOKEN_LOGIN_ROUTE } from './routes-def'
import { User } from '../models'
import UserSerializer from '../events/serializer/UserSerializer'

const tokenLoginRouter = express.Router()
tokenLoginRouter.post(TOKEN_LOGIN_ROUTE, tokenValidation, async (req: Request, res: Response) => {
	const user = await User.findById(req.user!.id)

	if (!user) throw new UserNotFoundError()
	if (!user.verified) throw new VerificationRequiredError()
	const userInfo = new UserSerializer(user)
	return res.status(userInfo.getStatusCode()).send(userInfo.serializeRest())
})

export default tokenLoginRouter

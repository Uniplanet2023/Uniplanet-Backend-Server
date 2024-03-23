import express, { Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import {
	NotAuthorizedError,
	UserNotFoundError,
	VerificationRequiredError,
	generateEmailVerificationToken,
	tokenValidation,
} from '@uniplanet-lib/common'
import { TOKEN_LOGIN_ROUTE } from './routes-def'
import { User } from '../models'
import UserSerializer from '../events/serializer/UserSerializer'

const tokenLoginRouter = express.Router()
tokenLoginRouter.post(TOKEN_LOGIN_ROUTE, tokenValidation, async (req: Request, res: Response) => {
	const user = await User.findById(req.user!.id)
	
	if (!user) throw new UserNotFoundError()
	if (!user.verified) throw new VerificationRequiredError()
	return res.status(201).send({ userId:user._id, school:user.school, access: true })
})

export default tokenLoginRouter

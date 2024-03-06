import express, { Request, Response } from 'express'
import { NotAuthorizedError, VerificationRequiredError, generateEmailVerificationToken, tokenValidation } from '@uniplanet-lib/common'
import { TOKEN_LOGIN_ROUTE } from './routes-def'
import { redisClient } from '../redis-client'
import { User } from '../models'

const tokenLoginRouter = express.Router()
tokenLoginRouter.post(TOKEN_LOGIN_ROUTE, tokenValidation, async (req: Request, res: Response) => {

	const result = await User.findOne({ email: req.user!.id })
	
	if (!result && req.user!.verified === 'false') {
		throw new NotAuthorizedError();
	}

	return res.status(201).send({ access: true })
})

export default tokenLoginRouter

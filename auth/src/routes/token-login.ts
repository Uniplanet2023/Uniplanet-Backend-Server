import express, { Request, Response } from 'express'
import { NotAuthorizedError, VerificationRequiredError, generateEmailVerificationToken, tokenValidation } from '@uniplanet-lib/common'
import { TOKEN_LOGIN_ROUTE } from './routes-def'
import { redisClient } from '../redis-client'

const tokenLoginRouter = express.Router()
tokenLoginRouter.post(TOKEN_LOGIN_ROUTE, tokenValidation, async (req: Request, res: Response) => {
	console.log(req.user!)
	if (!req.user!.verified) {
		throw new VerificationRequiredError();
	}
	console.log(req.session!.jwt);
	const result = await redisClient.redis.get(req.session!.jwt)
	
	if (!result) {
		throw new NotAuthorizedError();
	}

	return res.status(201).send({ access: true })
})

export default tokenLoginRouter

import express, { Request, Response } from 'express'
import { auth, tokenValidation } from '@uniplanet-lib/common'
import { LOG_OUT_SIGNIN_ROUTE } from './routes-def'
import { redisClient } from '../redis-client'

const signOutRouter = express.Router()
signOutRouter.delete(LOG_OUT_SIGNIN_ROUTE, tokenValidation, auth, async (req: Request, res: Response) => {
	
	// Remove the JWT from Redis
	await redisClient.redis.del(req.session!.jwt)
	// Clear the session
	req.session = null

	res.status(200).send({'message':'Logged Out Successfully'})
})
export default signOutRouter

import express, { Request, Response } from 'express'
import { tokenValidation } from '@uniplanet-lib/common'
import { SIGNOUT_OUT_SIGNIN_ROUTE } from './routes-def'

const signOutRouter = express.Router()
signOutRouter.delete(SIGNOUT_OUT_SIGNIN_ROUTE, tokenValidation, async (req: Request, res: Response) => {
	// Remove the JWT from Redis
	// Clear the session
	req.session = null
	req.user = undefined
	res.status(200).send({ message: 'Logged Out Successfully' })
})
export default signOutRouter

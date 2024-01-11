import express, { Request, Response } from 'express'
import { auth, tokenValidation } from '@uniplanet-lib/common'
import { LOG_OUT_SIGNIN_ROUTE } from './routes_def'

const signOutRoute = express.Router()
signOutRoute.post(LOG_OUT_SIGNIN_ROUTE, tokenValidation, auth, async (req: Request, res: Response) => {
	req.session = null

	res.send('sucess')
})
export default signOutRoute

import express, { Request, Response } from 'express'
import { GET_ACCOUNT_INFO } from './routes-def'
import { redisClient, tokenValidation } from '@uniplanet-lib/common'
import Account from '../models/account'
import GetAccountInfo from '../event/serializer/get-account'

const accountInfoRouter = express.Router()

accountInfoRouter.get(GET_ACCOUNT_INFO, tokenValidation, async (req: Request, res: Response) => {
	const accountData = await Account.findById(req.user!.id)
	if (!accountData) {
		return res.status(404).send({ message: 'Account not found' })
	}
	
	const accountInfo = new GetAccountInfo(accountData)

	return res.status(accountInfo.getStatusCode()).send(JSON.stringify(accountInfo.serializeRest()))
})

export default accountInfoRouter

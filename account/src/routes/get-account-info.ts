import express, { Request, Response } from 'express'
import { GET_ACCOUNT_INFO } from './routes-def'
import { tokenValidation } from '@uniplanet-lib/common'
import Account from '../models/account'
import GetAccountInfo from '../event/serializer/get-account'

const accountInfoRouter = express.Router()

accountInfoRouter.get(GET_ACCOUNT_INFO,tokenValidation, async (req: Request, res: Response) => {
	console.log('trigger');
	const accountData = await Account.findOne({ email: req.user!.email });
	if (!accountData) {
		return res.status(404).send({ message: 'Account not found' })
	}
	const accountInfo = new GetAccountInfo(accountData);
	console.log(accountInfo);
	return res.status(accountInfo.getStatusCode()).send(JSON.stringify(accountInfo.serializeRest()))
})

export default accountInfoRouter

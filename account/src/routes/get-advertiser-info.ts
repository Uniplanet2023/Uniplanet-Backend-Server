import express, { Request, Response } from 'express'
import { GET_ADVERTISER_INFO } from './routes-def'
import { tokenValidation } from '@uniplanet-lib/common'
import Account from '../models/account'
import GetAccountInfo from '../event/serializer/get-account'
import Advertiser from '../models/advertiser'
import GetAdvertiserInfo from '../event/serializer/get-advertiser'

const advertiserInfoRouter = express.Router()

advertiserInfoRouter.get(GET_ADVERTISER_INFO, tokenValidation, async (req: Request, res: Response) => {
	const account = await Account.findById(req.user!.id)
	if (!account) {
		return res.status(404).send({ message: 'Account not found' })
	}
	const accountInfo = new GetAccountInfo(account)

	if (req.user!.type === 'advertiser' || req.user!.type === 'admin') {
		const advertiser = await Advertiser.findOne({ account: req.user!.id })
		if (!advertiser || !advertiser.account) {
			return res.status(404).send({ message: 'Advertiser not found' })
		}

		const advertiserInfo = new GetAdvertiserInfo(advertiser, accountInfo.serializeRest())
		return res.status(advertiserInfo.getStatusCode()).send(JSON.stringify(advertiserInfo.serializeRest()))
	} else {
		return res.status(404).send({ message: 'Advertiser not found' })
	}
})

export default advertiserInfoRouter

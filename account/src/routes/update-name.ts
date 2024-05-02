import express, { Request, Response } from 'express'
import { UPDATE_NAME_ROUTE } from './routes-def'
import { kafkaClient, tokenValidation } from '@uniplanet-lib/common'
import Account from '../models/account'
import GetAccountInfo from '../event/serializer/get-account'
import { userUpdateProducer } from '..'

const updateNameRouter = express.Router()

updateNameRouter.put(UPDATE_NAME_ROUTE, tokenValidation, async (req: Request, res: Response) => {
	const { name } = req.body
	const accountData = await Account.findById(req.user!.id)
	if (!accountData) {
		return res.status(404).send({ message: 'Account not found' })
	}
	accountData.name = name
	await accountData.save()
	//TODO: Update other db using kafka

	const accountInfo = new GetAccountInfo(accountData)

	await userUpdateProducer.sendMessage({
		id: req.user!.id,
		name: name,
	})

	return res.status(accountInfo.getStatusCode()).send(JSON.stringify(accountInfo.serializeRest()))
})

export default updateNameRouter

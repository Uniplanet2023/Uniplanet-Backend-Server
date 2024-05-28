import express, { Request, Response } from 'express'
import { UPDATE_PROFILE_ROUTE } from './routes-def'
import { tokenValidation } from '@uniplanet-lib/common'
import Account from '../models/account'
import GetAccountInfo from '../event/serializer/get-account'
import { userUpdateProducer } from '..'
import { deleteFilesByPrefix } from '../../config/firease-delete-files'

const updateProfileRouter = express.Router()

updateProfileRouter.put(UPDATE_PROFILE_ROUTE, tokenValidation, async (req: Request, res: Response) => {
	const { profileImage } = req.body
	const accountData = await Account.findById(req.user!.id)
	if (!accountData) {
		return res.status(404).send({ message: 'Account not found' })
	}

	accountData.profileImage = profileImage
	await accountData.save()

	//TODO: Update other db using kafka

	const accountInfo = new GetAccountInfo(accountData, req.user!.type)
	await userUpdateProducer.sendMessage({
		id: req.user!.id,
		profileImage: profileImage,
	})
	return res.status(accountInfo.getStatusCode()).send(JSON.stringify(accountInfo.serializeRest()))
})

export default updateProfileRouter

import express, { Request, Response } from 'express'
import { UPDATE_PROFILE_ROUTE } from './routes-def'
import { tokenValidation } from '@uniplanet-lib/common'
import Account from '../models/account'
import GetAccountInfo from '../event/serializer/get-account'
import { cloudinaryAPI, userUpdateProducer } from '..'

const updateProfileRouter = express.Router()

updateProfileRouter.put(UPDATE_PROFILE_ROUTE, tokenValidation, async (req: Request, res: Response) => {
	const { profileImage } = req.body
	const accountData = await Account.findById(req.user!.id)
	if (!accountData) {
		return res.status(404).send({ message: 'Account not found' })
	}

	if (accountData.profileImage) {
		await cloudinaryAPI.api.delete_resources_by_prefix('profile-image/' + accountData.id + '/')
		await cloudinaryAPI.api.delete_folder('product-images/' + accountData.id)
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

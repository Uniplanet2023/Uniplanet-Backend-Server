import express, { Request, Response } from 'express'
import { BLOCK_CONTROL } from './routes-def'
import { tokenValidation } from '@uniplanet-lib/common'
import Account from '../models/account'
import GetAccountInfo from '../event/serializer/get-account'
import Advertiser from '../models/advertiser'
import GetAdvertiserInfo from '../event/serializer/get-advertiser'
import { userPostBlockProducer } from '..'

const blockRouter = express.Router()

blockRouter.post(BLOCK_CONTROL, tokenValidation, async (req: Request, res: Response) => {
	const { accountId, isPostBlock, isChatBlock, isBlock } = req.body
	if (accountId == undefined) {
		return res.status(400).send({ message: 'Invalid request' })
	}
	const account = await Account.findById(accountId)
	if (!account) {
		return res.status(404).send({ message: 'Account not found' })
	}
	const accountInfo = new GetAccountInfo(account)

	if (req.user!.type === 'admin') {
		const admin = await Account.findById(req.user!.id)
		if (!admin || admin.type !== 'admin') {
			return res.status(404).send({ message: 'Admin not found' })
		}

		const advertiser = await Advertiser.findOne({ account: account.id })
		if (!advertiser || !advertiser.account) {
			return res.status(404).send({ message: 'Advertiser not found' })
		}
		if (isBlock != undefined) {
			account.isBlocked = isBlock
			advertiser.account.isBlocked = isBlock
		}
		if (isChatBlock != undefined) {
			account.isBlockedChat = isChatBlock
			advertiser.account.isBlockedChat = isChatBlock
		}

		if (isPostBlock != undefined) {
			account.isBlockedPost = isPostBlock
			advertiser.account.isBlockedPost = isPostBlock
			userPostBlockProducer.sendMessage({
				id: account._id,
				postBlock: isPostBlock,
			})
		}

		await account.save()

		const advertiserInfo = new GetAdvertiserInfo(advertiser, accountInfo.serializeRest())
		return res.status(advertiserInfo.getStatusCode()).send(JSON.stringify(advertiserInfo.serializeRest()))
	} else {
		return res.status(404).send({ message: 'Advertiser not found' })
	}
})

export default blockRouter

import express, { Request, Response } from 'express'
import { POST_BLOCK_CONTROL } from './routes-def'
import { tokenValidation } from '@uniplanet-lib/common'
import Account from '../models/account'
import GetAccountInfo from '../event/serializer/get-account'
import Advertiser from '../models/advertiser'
import GetAdvertiserInfo from '../event/serializer/get-advertiser'

const postBlockRouter = express.Router()

postBlockRouter.post(POST_BLOCK_CONTROL, tokenValidation, async (req: Request, res: Response) => {
    const { accountId, postBlock} = req.body;
    if(!accountId || postBlock === undefined){
        return res.status(400).send({ message: 'Invalid request' })
    }
	const account = await Account.findById(accountId)
	if (!account) {
		return res.status(404).send({ message: 'Account not found' })
	}
	const accountInfo = new GetAccountInfo(account)

	if(req.user!.type === 'admin'){
        const admin = await Account.findById(req.user!.id);
        if (!admin || admin.type !== 'admin') {
            return res.status(404).send({ message: 'Admin not found' })
        }
        
		const advertiser = await Advertiser.findOne({account:req.user!.id});
		if (!advertiser || !advertiser.account) {
			return res.status(404).send({ message: 'Advertiser not found' })
		}

        account.isBlockedPost = postBlock;
        await advertiser.save();

		const advertiserInfo = new GetAdvertiserInfo(advertiser, accountInfo.serializeRest());
		return res.status(advertiserInfo.getStatusCode()).send(JSON.stringify(advertiserInfo.serializeRest()))

	}else{
        return res.status(404).send({ message: 'Advertiser not found' })
    }
})

export default postBlockRouter

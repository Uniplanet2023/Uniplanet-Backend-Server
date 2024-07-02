import express, { Request, Response } from 'express'
import { INCREASE_CREDIT } from './routes-def'
import { tokenValidation } from '@uniplanet-lib/common'
import Account from '../models/account'
import GetAccountInfo from '../event/serializer/get-account'
import Advertiser from '../models/advertiser'
import GetAdvertiserInfo from '../event/serializer/get-advertiser'
import { stripe } from '../app'
import jwt from 'jsonwebtoken'
const increaseCreditRequestRouter = express.Router()

increaseCreditRequestRouter.post(INCREASE_CREDIT, tokenValidation, async (req: Request, res: Response) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).send({ success: false, error: 'No token provided' });
    }
	const account = await Account.findById(req.user!.id)
	if (!account) {
		return res.status(404).send({ message: 'Account not found' })
	}

    const token = authHeader.split(' ')[1];
	const accountInfo = new GetAccountInfo(account)

	if(req.user!.type === 'advertiser'){
        // Increase credit
		const advertiser = await Advertiser.findOne({account:req.user!.id});
		if (!advertiser || !advertiser.account) {
			return res.status(404).send({ message: 'Advertiser not found' })
		}
        const decoded = jwt.verify(token, process.env.JWT_TOKEN_SECRET as string);
        const { paymentIntentId, creditValue } = decoded as any;

        // Verify the payment intent status
        const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
        if (paymentIntent.status !== 'succeeded') {
        return res.status(400).send({ success: false, error: 'Payment not confirmed' });
        }

        advertiser.credit = advertiser.credit + creditValue;
        await advertiser.save();
		const advertiserInfo = new GetAdvertiserInfo(advertiser, accountInfo.serializeRest());
		return res.status(advertiserInfo.getStatusCode()).send(JSON.stringify(advertiserInfo.serializeRest()))

	}else{
        return res.status(404).send({ message: 'Advertiser not found' })
    }
})

export default increaseCreditRequestRouter

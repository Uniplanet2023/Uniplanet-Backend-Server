import express, { Request, Response } from 'express';
import { GET_ADVERTISER_LIST } from './routes-def';
import { tokenValidation } from '@uniplanet-lib/common';
import Account from '../models/account';
import GetAccountInfo from '../event/serializer/get-account';
import Advertiser, { AdvertiserDocument } from '../models/advertiser';
import GetAdvertiserInfo from '../event/serializer/get-advertiser';
import { GetAdvertiserRestPayload } from '../event/serializer/type-def';

const advertiserListRouter = express.Router();

advertiserListRouter.get(GET_ADVERTISER_LIST, tokenValidation, async (req: Request, res: Response) => {
    const { page = 1 } = req.params; // Using query instead of params for pagination
    const account = await Account.findById(req.user!.id);

    if (!account) {
        return res.status(404).send({ message: 'Account not found' });
    }
    
    const advertiserListData: GetAdvertiserRestPayload[] = [];

    if (req.user!.type === 'admin') {
        const pageNumber = parseInt(page as string, 10);
        const pageSize = 10; // You can set this to any number you prefer

        const advertiserList = await Advertiser.find()
            .skip((pageNumber - 1) * pageSize)
            .limit(pageSize)
            .populate('account')
            .sort('updatedAt');

        advertiserList.forEach((advertiser: AdvertiserDocument) => {
            const advertiserAccount= new GetAccountInfo(advertiser.account);
            advertiserListData.push(new GetAdvertiserInfo(advertiser, advertiserAccount.serializeRest()).serializeRest());
        });
        
        return res.status(200).send(JSON.stringify(advertiserListData));
    } else {
        return res.status(404).send({ message: 'Advertiser not found' });
    }
});

export default advertiserListRouter;
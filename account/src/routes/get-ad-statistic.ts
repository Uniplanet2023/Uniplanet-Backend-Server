import express, { Request, Response } from 'express';
import { GET_AD_STATISTIC } from './routes-def';
import { tokenValidation } from '@uniplanet-lib/common';
import Advertiser from '../models/advertiser';
import { getClickStats } from '../utils/get-click-stats';


const adStatisticRouter = express.Router();

adStatisticRouter.get(GET_AD_STATISTIC, tokenValidation, async (req: Request, res: Response) => {
  const advertiser = await Advertiser.findOne({ account: req.user!.id });
  if (!advertiser) {
    return res.status(404).send({ message: 'Advertiser not found' });
  }

  const stats = await getClickStats(advertiser._id);
  return res.status(200).send(stats);
});

export default adStatisticRouter;
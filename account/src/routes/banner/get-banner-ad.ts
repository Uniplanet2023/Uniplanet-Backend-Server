import express, { Request, Response } from 'express';
import { GET_BANNER_AD } from '../routes-def';
import { tokenValidation } from '@uniplanet-lib/common';
import Banner from '../../models/banner';

const bannerAdRouter = express.Router();

bannerAdRouter.get(GET_BANNER_AD, tokenValidation, async (req: Request, res: Response) => {
  try {
    // Retrieve up to 5 random banner ads
    const banners = await Banner.aggregate([{ $sample: { size: 5 } }]);

    if (banners.length === 0) {
      return res.status(404).send({ message: 'No banner ads found' });
    }

    // Increment impressions count for each retrieved banner
    const bannerIds = banners.map((banner) => banner._id);
    await Banner.updateMany(
      { _id: { $in: bannerIds } },
      { $inc: { impressions: 1 } }
    );

    res.status(200).json(banners);
  } catch (error) {
    console.error('Error fetching banner ads:', error);
    res.status(500).send({ message: 'Internal server error' });
  }
});

export default bannerAdRouter;
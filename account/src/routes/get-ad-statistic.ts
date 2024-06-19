import express, { Request, Response } from 'express';
import { GET_AD_STATISTIC } from './routes-def';
import { tokenValidation } from '@uniplanet-lib/common';
import Advertiser from '../models/advertiser';
import AdInteraction from '../models/ad-interaction';

const adStatisticRouter = express.Router();

adStatisticRouter.get(GET_AD_STATISTIC, tokenValidation, async (req: Request, res: Response) => {
  const advertiser = await Advertiser.findOne({ account: req.user!.id });
  if (!advertiser) {
    return res.status(404).send({ message: 'Advertiser not found' });
  }

  const today = new Date();
  const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const startOfYear = new Date(today.getFullYear(), 0, 1);
  const sevenDaysAgo = new Date(today.setDate(today.getDate() - 6));

  const todayCount = await AdInteraction.countDocuments({
    advertiser: advertiser._id,
    createdAt: { $gte: startOfDay },
  });

  const weekCount = await AdInteraction.countDocuments({
    advertiser: advertiser._id,
    createdAt: { $gte: startOfWeek },
  });

  const monthCount = await AdInteraction.countDocuments({
    advertiser: advertiser._id,
    createdAt: { $gte: startOfMonth },
  });

  const yearCount = await AdInteraction.countDocuments({
    advertiser: advertiser._id,
    createdAt: { $gte: startOfYear },
  });

  // Aggregate data for the last 7 days
  const recentDaysData = await AdInteraction.aggregate([
    {
      $match: {
        advertiser: advertiser._id,
        createdAt: { $gte: sevenDaysAgo },
      },
    },
    {
      $group: {
        _id: {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' },
          day: { $dayOfMonth: '$createdAt' },
        },
        count: { $sum: 1 },
      },
    },
    {
      $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 },
    },
  ]);

  // Fetch the 10 most recent unique users who have clicked the advertiser's ads
  const recentUsers = await AdInteraction.aggregate([
    {
      $match: {
        advertiser: advertiser._id,
      },
    },
    {
      $sort: { createdAt: -1 },
    },
    {
      $group: {
        _id: '$account',
        lastInteraction: { $first: '$createdAt' },
      },
    },
    {
      $sort: { lastInteraction: -1 },
    },
    {
      $limit: 10,
    },
    {
      $lookup: {
        from: 'accounts',
        localField: '_id',
        foreignField: '_id',
        as: 'account',
      },
    },
    {
      $unwind: '$account',
    },
    {
      $project: {
        _id: 0,
        account: {
          id: '$account._id',
          name: '$account.name', // Adjust this based on your Account schema
          email: '$account.email', // Adjust this based on your Account schema
        },
        lastInteraction: 1,
      },
    },
  ]);

  return res.status(200).send({
    todayCount,
    weekCount,
    monthCount,
    yearCount,
    recentDaysData,
    recentUsers,
  });
});

export default adStatisticRouter;
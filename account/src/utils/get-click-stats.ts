import { ObjectId } from 'mongoose';
import AdDailyStats from '../models/ad-daily-stats';
import { getRecent7Days, getStartOfDay, getStartOfMonth, getStartOfWeek, getStartOfYear } from './date-calculate';

async function getClickStats(advertiserId:ObjectId, advertisementTitle:string) {
  const now = new Date();
  
  const startOfDay = getStartOfDay(now);
  const startOfWeek = getStartOfWeek(now);
  const startOfMonth = getStartOfMonth(now);
  const startOfYear = getStartOfYear(now);
  const recent7Days = getRecent7Days(now);

  // Aggregation pipeline for different date ranges
  const pipeline = [
    {
      $match: {
        advertiser: advertiserId,
        advertisement: advertisementTitle,
        date: { $gte: startOfYear }
      }
    },
    {
      $group: {
        _id: {
          $cond: [
            { $gte: ["$date", startOfDay] }, "day",
            { $cond: [
              { $gte: ["$date", startOfWeek] }, "week",
              { $cond: [
                { $gte: ["$date", startOfMonth] }, "month",
                "year"
              ]}
            ]}
          ]
        },
        clickCount: { $sum: "$clickCount" }
      }
    }
  ];

  const stats = await AdDailyStats.aggregate(pipeline);
  
  const todayStats = stats.find(s => s._id === "day") || { clickCount: 0 };
  const weekStats = stats.find(s => s._id === "week") || { clickCount: 0 };
  const monthStats = stats.find(s => s._id === "month") || { clickCount: 0 };
  const yearStats = stats.find(s => s._id === "year") || { clickCount: 0 };
  
  const recent7DaysStats = await AdDailyStats.find({
    advertiser: advertiserId,
    advertisement: advertisementTitle,
    date: { $in: recent7Days }
  }).sort({ date: 1 });

  return {
    today: todayStats.clickCount,
    thisWeek: weekStats.clickCount,
    thisMonth: monthStats.clickCount,
    thisYear: yearStats.clickCount,
    recent7Days: recent7DaysStats.map(s => ({ date: s.date, clickCount: s.clickCount }))
  };
}
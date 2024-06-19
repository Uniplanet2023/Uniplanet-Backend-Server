import { ObjectId } from 'mongoose';
import AdInteraction from '../models/ad-interaction';
import { getRecent7Days, getStartOfDay, getStartOfMonth, getStartOfWeek, getStartOfYear } from './date-calculate';

export async function getClickStats(advertiserId:ObjectId) {
  const now = new Date();
  
  const startOfDay = getStartOfDay(now);
  const startOfWeek = getStartOfWeek(now);
  const startOfMonth = getStartOfMonth(now);
  const startOfYear = getStartOfYear(now);
  const recent7Days = getRecent7Days(now);
  console.log(startOfDay )
  // Aggregation pipeline for different date ranges
  const pipeline = [
    {
      $match: {
        advertiser: advertiserId,
        createdAt: { $gte: startOfYear }
      }
    },
    {
      $group: {
        _id: null,
        today: {
          $sum: {
            $cond: [
              { $gte: ["$createdAt", startOfDay] }, 1, 0
            ]
          }
        },
        thisWeek: {
          $sum: {
            $cond: [
              { $gte: ["$createdAt", startOfWeek] }, 1, 0
            ]
          }
        },
        thisMonth: {
          $sum: {
            $cond: [
              { $gte: ["$createdAt", startOfMonth] }, 1, 0
            ]
          }
        },
        thisYear: {
          $sum: {
            $cond: [
              { $gte: ["$createdAt", startOfYear] }, 1, 0
            ]
          }
        }
      }
    }
  ];

  const stats = await AdInteraction.aggregate(pipeline);
  
  const todayStats = stats.length ? stats[0].today : 0;
  const weekStats = stats.length ? stats[0].thisWeek : 0;
  const monthStats = stats.length ? stats[0].thisMonth : 0;
  const yearStats = stats.length ? stats[0].thisYear : 0;
  
  const recent7DaysStats = await AdInteraction.aggregate([
    {
      $match: {
        advertiser: advertiserId,
        createdAt: { $gte: recent7Days[6] }
      }
    },
    {
      $group: {
        _id: {
          $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
        },
        clickCount: { $sum: 1 }
      }
    },
    { $sort: { _id: 1 } }
  ]);
  console.log(recent7DaysStats);
  const recent7DaysData = recent7Days.map(date => {
    const dateString = new Date(date).toISOString().split('T')[0];
    const dayStats = recent7DaysStats.find(s => s._id === dateString);
    return { date: dateString, clickCount: dayStats ? dayStats.clickCount : 0 };
  });
  console.log(recent7DaysStats);
  return {
    today: todayStats,
    thisWeek: weekStats,
    thisMonth: monthStats,
    thisYear: yearStats,
    recent7Days: recent7DaysData
  };
}
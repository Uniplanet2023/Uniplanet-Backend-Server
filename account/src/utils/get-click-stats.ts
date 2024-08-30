import { ObjectId } from 'mongoose'
import AdDailyStats from '../models/ad-daily-stats'
import { getRecent7Days, getStartOfDay, getStartOfMonth, getStartOfWeek, getStartOfYear } from './date-calculate'

export async function getClickStats(advertiserId: ObjectId) {
	const now = new Date()

	const startOfDay = getStartOfDay(now)
	const startOfWeek = getStartOfWeek(now)
	const startOfMonth = getStartOfMonth(now)
	const startOfYear = getStartOfYear(now)
	const recentWeekDays = getRecent7Days(now)

	// Aggregation pipeline for different date ranges
	const pipeline = [
		{
			$match: {
				advertiser: advertiserId,
				date: { $gte: startOfYear },
			},
		},
		{
			$group: {
				_id: null,
				today: {
					$sum: {
						$cond: [{ $gte: ['$date', startOfDay] }, '$clickCount', 0],
					},
				},
				thisWeek: {
					$sum: {
						$cond: [{ $gte: ['$date', startOfWeek] }, '$clickCount', 0],
					},
				},
				thisMonth: {
					$sum: {
						$cond: [{ $gte: ['$date', startOfMonth] }, '$clickCount', 0],
					},
				},
				thisYear: {
					$sum: {
						$cond: [{ $gte: ['$date', startOfYear] }, '$clickCount', 0],
					},
				},
			},
		},
	]

	const stats = await AdDailyStats.aggregate(pipeline)
	

	const todayStats = stats.length ? stats[0].today : 0
	const weekStats = stats.length ? stats[0].thisWeek : 0
	const monthStats = stats.length ? stats[0].thisMonth : 0
	const yearStats = stats.length ? stats[0].thisYear : 0

	const recent7DaysStats = await AdDailyStats.aggregate([
		{
			$match: {
				advertiser: advertiserId,
				date: { $gte: recentWeekDays[0] },
			},
		},
		{
			$group: {
				_id: {
					$dateToString: { format: '%Y-%m-%d', date: '$date' },
				},
				clickCount: { $sum: '$clickCount' },
			},
		},
		{ $sort: { _id: 1 } },
	])

	const recent7DaysData = recentWeekDays.map(date => {
		const dateString = date.toISOString().split('T')[0]
		const dayStats = recent7DaysStats.find(s => s._id === dateString)
		return { date: dateString, clickCount: dayStats ? dayStats.clickCount : 0 }
	})

	return {
		today: todayStats,
		thisWeek: weekStats,
		thisMonth: monthStats,
		thisYear: yearStats,
		recent7Days: recent7DaysData,
	}
}

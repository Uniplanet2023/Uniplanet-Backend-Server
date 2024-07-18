import express, { Request, Response } from 'express'
import { tokenValidation } from '@uniplanet-lib/common'
import Report from '../models/report'
import Account from '../models/account'
import { REPORT_USER } from './routes-def'

const createReportRouter = express.Router()

createReportRouter.post(REPORT_USER, tokenValidation, async (req: Request, res: Response) => {
	const { reportType, description, reportedUserId, productId } = req.body

	// Ensure the reporter exists
	const reporter = await Account.findById(reportedUserId)
	if (!reporter) {
		return res.status(404).send({ message: 'Reporter account not found' })
	}
	reporter.numberOfReports += 1
	if (reporter.numberOfReports >= 3) {
		reporter.status = 'suspended'
		if (reporter.numberOfReports >= 5) {
			reporter.status = 'banned'
			reporter.isBlocked = true
			reporter.isBlockedChat = true
			reporter.isBlockedPost = true
		}
	}
	await reporter.save()
	// Create the report
	const report = Report.build({
		reporterId: req.user!.id,
		reportedUserId,
		productId,
		reportType,
		description,
	})

	await report.save()

	return res.status(201).send(report)
})

export default createReportRouter

import express, { Request, Response } from 'express'
import { tokenValidation } from '@uniplanet-lib/common'
import Report from '../models/report'
import Account from '../models/account'
import { REPORT_USER } from './routes-def'
import { firebaseAdmin } from '..'
import { sendReportEmail } from '../utils/sending-report-email'

const createReportRouter = express.Router()

createReportRouter.post(REPORT_USER, tokenValidation, async (req: Request, res: Response) => {
	const { reportType, description, reportedUserId, productId } = req.body

	// Ensure the reporter exists
	const reportedUser = await Account.findById(reportedUserId)
	if (!reportedUser) {
		return res.status(404).send({ message: 'reportedUser account not found' })
	}
	const reportUser = await Account.findById(req.user!.id)
	if (!reportUser) {
		return res.status(404).send({ message: 'reporter account not found' })
	}

	reportedUser.numberOfReports += 1
	// if (reportedUser.numberOfReports >= 3) {
		// reportedUser.status = 'suspended'
		// if (reportedUser.numberOfReports >= 10) {
		// 	reportedUser.status = 'banned'
		// 	reportedUser.isBlocked = true
		// 	reportedUser.isBlockedChat = true
		// 	reportedUser.isBlockedPost = true
		// }
	// }
	await reportedUser.save()
	// Create the report
	const report = Report.build({
		reporterId: req.user!.id,
		reportedUserId,
		productId,
		reportType,
		description,
	})

	await report.save()
	sendReportEmail({
		report,
		reportUser,
		reportedUser,
	});

	return res.status(201).send(report)
})

export default createReportRouter

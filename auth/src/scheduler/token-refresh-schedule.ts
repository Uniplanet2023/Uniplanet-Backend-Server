import { IScheduler, NodemailerSmtpServer, Scheduler } from '@uniplanet-lib/common'

class TokenRefreshScheduler extends Scheduler {
	constructor() {
		// run every hour
		// second min hour (day of month) monrh (day of week month)
		super('00 00 03 * * *')
	}

	executeJob(): Promise<IScheduler> {
		const smtpServer: NodemailerSmtpServer = new NodemailerSmtpServer()
		console.log('Token Refresh Scheduler is running')
		return new Promise(async resolve => {
			smtpServer.getAccessToken()
			resolve({
				success: true,
			})
		})
	}
}
export default TokenRefreshScheduler

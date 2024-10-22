// import { IScheduler, NodemailerSmtpServer, Scheduler } from '@uniplanet-lib/common'

// class TokenRefreshScheduler extends Scheduler {
// 	constructor() {
// 		// run at 3 AM and 12 PM
// 		// second min hour (day of month) month (day of week month)
// 		super('00 00 03,12 * * *')
// 	}

// 	executeJob(): Promise<IScheduler> {
// 		const smtpServer: NodemailerSmtpServer = new NodemailerSmtpServer()
// 		console.log('Token Refresh Scheduler is running')
// 		return new Promise(async resolve => {
// 			try {
// 				await smtpServer.getAccessToken()
// 				resolve({
// 					success: true,
// 				})
// 			} catch (error) {
// 				console.error('Error refreshing SMTP token:', error)
// 				resolve({
// 					success: false,
// 				})
// 			}
// 		})
// 	}
// }

// export default TokenRefreshScheduler

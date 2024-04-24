import { IScheduler, NodemailerSmtpServer, Scheduler } from '@uniplanet-lib/common'
import { User } from '../models'

class TokenRefreshScheduler extends Scheduler {
	constructor() {
		// run every hour
		// second min hour (day of month) monrh (day of week month)
		super('00 00 02 * * *')
	}

	executeJob(): Promise<IScheduler> {
		const smtpServer:NodemailerSmtpServer = new NodemailerSmtpServer();
        
        return new Promise(async resolve => {
			smtpServer.getAccessToken();
            resolve({
                success: true,
            });
		})
	}
}
export default TokenRefreshScheduler

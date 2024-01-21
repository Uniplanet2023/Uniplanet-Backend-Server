import { google, Auth } from 'googleapis'
import { GmailServerConfigAuth, NodemailerServerConfigAuth, SmtpServer, SmtpServerConfig } from './types'
export default class NodemailerSmtpServer implements SmtpServer {
	private host = process.env.SMTP_HOST!

	private port = parseInt(process.env.SMTP_PORT!)

	private smtpPublic = process.env.CLIENT_ID!

	private smtpPrivate = process.env.CLIENT_SECRET!

	private smtpRedirect = process.env.REDIRECT_URI!

	private smtpRefreshToken = process.env.REFRESH_TOKEN!

	private key = process.env.OTP_KEY!

	private oAuth2Client: null | undefined | Auth.OAuth2Client

	private accessToken: null | undefined | string

	constructor() {
		if (process.env.NODE_ENV == 'production') {
			this.oAuth2Client = new google.auth.OAuth2(this.smtpPublic, this.smtpPrivate, this.smtpRedirect)
			this.oAuth2Client.setCredentials({ refresh_token: this.smtpRefreshToken })
			if (this.oAuth2Client == null || this.oAuth2Client == undefined) {
				throw Error('oAuth2 has Error')
			}
		}
	}

	async getAccessToken() {
		console.log(this.accessToken)
		if (this.accessToken === undefined || this.accessToken === null) {
			try {
				if (this.oAuth2Client) {
					this.accessToken = (await this.oAuth2Client.getAccessToken()).token
					return this.accessToken
				} else {
					throw Error('oAuth2Client is not exist')
				}
			} catch (e) {
				throw Error('SMTP token unavailable')
			}
		} else {
			return this.accessToken
		}
	}

	getConfig(): SmtpServerConfig {
		const config: SmtpServerConfig = {
			host: this.host,
			port: this.port,
		}

		if (process.env.NODE_ENV == 'production') {
			config.secure = true
			config.auth = {
				type: 'OAuth2',
				user: 'uniplanet.info@gmail.com',
				clientId: this.smtpPublic,
				clientSecret: this.smtpPrivate,
				refreshToken: this.smtpRefreshToken,
			} as GmailServerConfigAuth
		} else {
			config.auth = {
				user: this.smtpPublic,
				pass: this.smtpPrivate,
			} as NodemailerServerConfigAuth
		}
		return config
	}
}

import Mail from 'nodemailer/lib/mailer'
import {
	EmailApiSendEmailArgs,
	EmailApiSendEmailResponse,
	EmailApi,
	EmailApiSendSignUpVerificationEmailArgs,
	EmailApiSendResetPasswordResponse,
	EmailApiSendResetPasswordEmailArgs,
} from './types'
import nodemailer from 'nodemailer'
import NodemailerSmtpServer from './nodemailer_app_smtp_server'
import { otpGenerate } from '../account_verification/otp_generater'

import {
	buildSignUpVerificationEmailHtmlBody,
	buildSignUpVerificationEmailSubject,
	buildSignUpVerificationEmailTextBody,
} from './mail_text'
import { generatePassword } from '../password_generator'
import {
	buildResetPasswordEmailBody,
	buildResetPasswordEmailHtml,
	buildResetPasswordEmailSubject,
} from './mail_text/reset_password_text'

export default class NodemailerEmailApi implements EmailApi {
	private transporter: Mail

	private smtpServer: NodemailerSmtpServer

	constructor() {
		this.smtpServer = new NodemailerSmtpServer()
		this.transporter = nodemailer.createTransport(this.smtpServer.getConfig() as nodemailer.SendMailOptions)
	}

	async sendSignUpVerificationEmail(args: EmailApiSendSignUpVerificationEmailArgs): Promise<EmailApiSendEmailResponse> {
		const { name, toEmail } = args

		const [otpCode, fullHash] = otpGenerate(toEmail)
		console.log(`otpCode is ${otpCode}`)
		console.log(`fullHash is ${fullHash}`)

		const subject = buildSignUpVerificationEmailSubject(name)
		const textBody = buildSignUpVerificationEmailTextBody({ name, otpCode })
		const htmlBody = buildSignUpVerificationEmailHtmlBody({ name, otpCode })

		await this.sendEmail({
			toEmail,
			subject,
			textBody,
			htmlBody,
		})

		return {
			toEmail,
			status: 'success',
			hash: fullHash,
		}
	}

	async sendPasswordResetEmail(args: EmailApiSendResetPasswordEmailArgs): Promise<EmailApiSendResetPasswordResponse> {
		const { toEmail } = args
		const tempPassword = generatePassword()
		const subject = buildResetPasswordEmailSubject()
		const textBody = buildResetPasswordEmailBody(tempPassword)
		const htmlBody = buildResetPasswordEmailHtml(tempPassword)
		await this.sendEmail({
			toEmail,
			subject,
			textBody,
			htmlBody,
		})
		return {
			toEmail,
			status: 'success',
			tempPassword,
		}
	}

	private async sendEmail(args: EmailApiSendEmailArgs): Promise<void> {
		const { toEmail, subject, htmlBody, textBody } = args
		const accessToken = await this.smtpServer.getAccessToken()
		await this.transporter.sendMail({
			from: 'UniPlanet ✉️ <noreply@uniplanet.com>',
			to: toEmail,
			subject,
			text: textBody,
			html: htmlBody,
			auth: {
				accessToken: accessToken,
			},
		} as nodemailer.SendMailOptions)
	}
}

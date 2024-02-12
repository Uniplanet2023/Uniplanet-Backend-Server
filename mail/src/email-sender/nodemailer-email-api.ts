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
import NodemailerSmtpServer from './nodemailer-app-smtp-server'


import {
	buildSignUpVerificationEmailHtmlBody,
	buildSignUpVerificationEmailSubject,
	buildSignUpVerificationEmailTextBody,
} from './mail-text'

import {
	buildResetPasswordEmailBody,
	buildResetPasswordEmailHtml,
	buildResetPasswordEmailSubject,
} from './mail-text/reset-password-text'
import { generatePassword } from '@uniplanet-lib/common'
import { otpGenerate } from '../utils/account-verification'

export class NodemailerEmailApi implements EmailApi {
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
		console.log(toEmail)
		const accessToken = await this.smtpServer.getAccessToken()
		console.log(accessToken)
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

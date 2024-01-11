import {
	EmailApiSendSignUpVerificationEmailArgs,
	EmailApiSendEmailResponse,
	EmailApi,
	EmailApiSendResetPasswordResponse,
	EmailApiSendResetPasswordEmailArgs,
} from './types'

export default class EmailSender implements EmailApi {
	private isActive = false

	private emailApi: EmailApi | undefined

	private static emailSenderInstance: EmailSender

	private constructor() {
		//op-no
	}

	static getInstance(): EmailSender {
		if (!this.emailSenderInstance) {
			this.emailSenderInstance = new EmailSender()
		}

		return this.emailSenderInstance
	}

	static resetEmailSenderInstance(): void {
		this.emailSenderInstance = new EmailSender()
	}

	deactivate(): void {
		this.isActive = false
	}

	activate(): void {
		this.isActive = true
	}

	setEmailApi(emailApi: EmailApi): void {
		this.emailApi = emailApi
	}

	async sendSignUpVerificationEmail(args: EmailApiSendSignUpVerificationEmailArgs): Promise<EmailApiSendEmailResponse> {
		this.validateEmailSender()

		return this.emailApi!.sendSignUpVerificationEmail(args)
	}

	async sendPasswordResetEmail(args: EmailApiSendResetPasswordEmailArgs): Promise<EmailApiSendResetPasswordResponse> {
		const { toEmail } = args
		this.validateEmailSender()
		return this.emailApi!.sendPasswordResetEmail({ toEmail })
	}

	private validateEmailSender() {
		if (!this.isActive) {
			throw new Error('EmailSender is not active')
		}
		if (!this.emailApi) {
			throw new Error('EmailApi is not set')
		}
	}
}

export type EmailApiSendSignUpVerificationEmailArgs = {
	name: string

	toEmail: string
}
export type EmailApiSendResetPasswordEmailArgs = {
	toEmail: string
}
export type EmailApiSendEmailArgs = {
	toEmail: string
	subject: string
	textBody: string
	htmlBody: string
}
export type EmailApiSendEmailResponse = {
	toEmail: string
	status: 'success' | 'error'
	hash: string
}

export type EmailApiSendResetPasswordResponse = {
	toEmail: string
	status: 'success' | 'error'
	tempPassword: string
}
export type NodemailerServerConfigAuth = {
	user: string
	pass: string
}
export type GmailServerConfigAuth = {
	type: string
	user: string
	clientId: string
	clientSecret: string
	refreshToken: string
}
export type SmtpServerConfigAuth = NodemailerServerConfigAuth | GmailServerConfigAuth

export type SmtpServerConfig = {
	host: string
	port: number
	secure?: boolean
	auth?: SmtpServerConfigAuth
}
export interface EmailApi {
	sendSignUpVerificationEmail(args: EmailApiSendSignUpVerificationEmailArgs): Promise<EmailApiSendEmailResponse>
	sendPasswordResetEmail(args: EmailApiSendResetPasswordEmailArgs): Promise<EmailApiSendResetPasswordResponse>
}
export interface SmtpServer {
	getConfig(): SmtpServerConfig
}

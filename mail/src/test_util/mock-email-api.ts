import { generateEmailVerificationToken, generatePassword } from '@uniplanet-lib/common'
import {
	EmailApiSendEmailResponse,
	EmailApi,
	EmailApiSendSignUpVerificationEmailArgs,
	EmailApiSendResetPasswordEmailArgs,
	EmailApiSendResetPasswordResponse,
} from '../email-sender/types'

export const mockSendSignUpVerificationEmail = jest.fn(
	(toEmail: string): Promise<EmailApiSendEmailResponse> =>
		new Promise(resolve => resolve({ toEmail, status: 'success', hash: generateEmailVerificationToken() })),
)
export const mockSendResetPasswordEmail = jest.fn(
	(toEmail: string): Promise<EmailApiSendResetPasswordResponse> =>
		new Promise(resolve => resolve({ toEmail, status: 'success', tempPassword: generatePassword() })),
)
export class MockEmailApi implements EmailApi {
	sendPasswordResetEmail(args: EmailApiSendResetPasswordEmailArgs): Promise<EmailApiSendResetPasswordResponse> {
		const { toEmail } = args
		return mockSendResetPasswordEmail(toEmail)
	}

	sendSignUpVerificationEmail({
		toEmail,
	}: EmailApiSendSignUpVerificationEmailArgs): Promise<EmailApiSendEmailResponse> {
		return mockSendSignUpVerificationEmail(toEmail)
	}
}

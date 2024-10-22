import { otpGenerate } from '@uniplanet-lib/common'
import {
	buildSignUpVerificationEmailHtmlBody,
	buildSignUpVerificationEmailSubject,
	buildSignUpVerificationEmailTextBody,
} from '../config/signup-email-format'
import { firebaseAdmin } from '..'

// Function to send the sign-up verification email
export async function sendVerificationEmail(email: string): Promise<string> {
	const [otpCode, fullHash] = otpGenerate(email)
	const subject = buildSignUpVerificationEmailSubject()
	const textBody = buildSignUpVerificationEmailTextBody({ otpCode })
	const htmlBody = buildSignUpVerificationEmailHtmlBody({ otpCode })
	firebaseAdmin
		.firestore()
		.collection('mail')
		.add({
			to: email,
			message: {
				subject: subject,
				text: textBody,
				html: htmlBody,
			},
		})
		.then(() => console.log('Queued email for delivery!'))
		.catch(error => console.error('Error queuing email:', error))

	return fullHash
}

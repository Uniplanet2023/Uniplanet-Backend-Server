import { EmailSender } from "@uniplanet-lib/common"

// Function to send the sign-up verification email
export async function sendVerificationEmail(email: string) {
	const emailSender = EmailSender.getInstance()
	const { status, hash } = await emailSender.sendSignUpVerificationEmail({
		toEmail: email,
	})
	return { status, hash }
}
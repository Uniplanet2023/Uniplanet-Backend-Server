import { EmailSender } from "@uniplanet-lib/common"

// Function to send the sign-up verification email
export async function sendVerificationEmail(name: string, email: string) {
	const emailSender = EmailSender.getInstance()
	const { status, hash } = await emailSender.sendSignUpVerificationEmail({
		name,
		toEmail: email,
	})
	return { status, hash }
}
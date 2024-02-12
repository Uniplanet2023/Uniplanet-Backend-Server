import otpGenerator from 'otp-generator'
import crypto from 'crypto'

export const otpGenerate = (email: string) => {
	const otpCode = otpGenerator.generate(5, {
		digits: true,
		upperCaseAlphabets: false,
		lowerCaseAlphabets: false,
		specialChars: false,
	})
	const ttl = 5 * 60 * 1000 // time to live (5 mins)
	const expires = Date.now() + ttl

	const data = `${email}.${otpCode}.${expires}`

	const hash = crypto
		.createHmac('sha256', process.env.OTP_KEY as string)
		.update(data)
		.digest('hex')
	const fullHash = `${hash}.${expires}`

	return [otpCode, fullHash]
}

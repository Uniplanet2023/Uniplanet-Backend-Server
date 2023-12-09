import crypto from 'crypto'
const key = process.env.OTP_KEY as string

type VerifyOtpParams = {
	otpHash: string
	email: string
	otpCode: string
}

export const verifyOtp = async (params: VerifyOtpParams) => {
	const [otpHash, expires] = params.otpHash.split('.')
	const now = Date.now()

	// checking if OTP received is expired before continuing
	if (now > parseInt(expires, 10)) {
		const notice = 'OTP expired'
		return notice
	}

	const data = `${params.email}.${params.otpCode}.${expires}`

	const newCalculatedHash = crypto.createHmac('sha256', key).update(data).digest('hex')

	if (otpHash === newCalculatedHash) {
		return 'Success'
	}
	return 'Invalid Verfication number'
}

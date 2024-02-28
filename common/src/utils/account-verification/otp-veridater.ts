import crypto from 'crypto'
import { Signup } from '../../api-status'


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
		const notice = Signup.OTP_EXPIRED
		return notice
	}

	const data = `${params.email}.${params.otpCode}.${expires}`
	
	const newCalculatedHash = crypto.createHmac('sha256', process.env.OTP_KEY as string).update(data).digest('hex')

	if (otpHash === newCalculatedHash) {
		return 'Success'
	}
	return Signup.OTP_INVALID_NUMBER
}

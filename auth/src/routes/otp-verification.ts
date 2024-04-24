import express, { Request, Response } from 'express'
import { User } from '../models'
import { VERIFY_OTP_ROUTE } from './routes-def'
import { OTPExpiredError, OTPInvalidNumberError, Signup, UserNotFoundError, verifyOtp } from '@uniplanet-lib/common'
const otpValidationRouter = express.Router()

otpValidationRouter.post(VERIFY_OTP_ROUTE, async (req: Request, res: Response) => {
	const { otpHash, email, otpCode } = req.body

	const result = await verifyOtp({ otpHash, email, otpCode })

	switch (result) {
		case 'Success':
			const user = await User.findOne({ email })
			if (!user) throw new UserNotFoundError()
			await User.findByIdAndUpdate(user.id, { verified: true })
			return res.status(200).json({ message: result })
		case Signup.OTP_EXPIRED:
			throw new OTPExpiredError()
		case Signup.OTP_INVALID_NUMBER:
			throw new OTPInvalidNumberError()
		default:
			throw new Error('Error while processing OTP')
	}
})

export default otpValidationRouter

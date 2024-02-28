import express, { Request, Response } from 'express'
import { User } from '../models'
import { VERIFY_OTP_ROUTE } from './routes-def'
import { InvalidInput, OTPExpiredError, OTPInvalidNumberError, Signup, UserNotFoundError, verifyOtp } from '@uniplanet-lib/common'
import jwt from 'jsonwebtoken'
import { redisClient } from '../redis-client'
const otpValidationRouter = express.Router()

otpValidationRouter.post(VERIFY_OTP_ROUTE, async (req: Request, res: Response) => {
	
		const { otpHash, email, otpCode } = req.body
		console.log(otpHash)
		console.log(otpCode)
		console.log(email)
		const result = await verifyOtp({ otpHash, email, otpCode })

		switch (result) {
			case 'Success':
				const user = await User.findOne({ email })
				if (!user) throw new UserNotFoundError();
				await User.findByIdAndUpdate(user.id, { verified: true })
				await redisClient.redis.set(user.email, JSON.stringify({ verified: true }))
				return res.status(200).json({ message: result })
			case Signup.OTP_EXPIRED:
				throw new OTPExpiredError();
			case Signup.OTP_INVALID_NUMBER:
				throw new OTPInvalidNumberError();
			default:
				throw new Error('Error while processing OTP');
		}
	
})

export default otpValidationRouter

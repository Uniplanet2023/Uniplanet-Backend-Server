import express, { Request, Response } from 'express'
import { AccountVerification, User } from '../models'
import { VERIFY_OTP_ROUTE } from './routes-def'
import { verifyOtp } from '@uniplanet-lib/common'

const tokenValidationRouter = express.Router()

tokenValidationRouter.post(VERIFY_OTP_ROUTE, async (req: Request, res: Response) => {
	try {
		const { otpHash, email, otpCode } = req.body
		const result = await verifyOtp({ otpHash, email, otpCode })

		switch (result) {
			case 'Success':
				const user = await User.findOne({ email })
				if (!user) {
					throw Error('Error! No User ')
				} else {
					user.updateOne({ verified: true })
					await AccountVerification.create({ userId: user.id })
				}
				return res.status(200).json({ message: result })
			case 'OTP expired':
				return res.status(401).json({ message: result })
			case 'Invalid Verification number':
				return res.status(401).json({ message: result })
			default:
				return res.status(400).json({ message: 'Invalid response' })
		}
	} catch (error) {
		res.status(400).json({ message: 'Error while processing OTP', error })
	}
})

export default tokenValidationRouter

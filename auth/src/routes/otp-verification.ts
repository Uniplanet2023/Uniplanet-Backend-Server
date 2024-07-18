import express, { Request, Response } from 'express'
import { User } from '../models'
import { VERIFY_OTP_ROUTE } from './routes-def'
import { OTPExpiredError, OTPInvalidNumberError, Signup, UserNotFoundError, verifyOtp } from '@uniplanet-lib/common'
import { userCreatedProducer, userRestoreProducer } from '..'
import { generateToken } from '../utils/enforce-token-unique'
import UserSerializer from '../events/serializer/UserSerializer'
const otpValidationRouter = express.Router()

otpValidationRouter.post(VERIFY_OTP_ROUTE, async (req: Request, res: Response) => {
	const { otpHash, email, otpCode } = req.body

	const result = await verifyOtp({ otpHash, email, otpCode })

	switch (result) {
		case 'Success':
			const user = await User.findOne({ email })
			if (!user) throw new UserNotFoundError()
			await User.findByIdAndUpdate(user.id, { verified: true, deletionDate: null })
			userCreatedProducer.sendMessage({
				id: user.id,
				name: user.name,
				email: user.email,
				school: user.school,
				profileImage: user.profileImage,
				type: user.type,
			})
			// Generate JWT
		const userJwt = await generateToken(user)
		if (user.deletionDate) {
			await User.findByIdAndUpdate({ _id: user.id }, { deletionDate: null }, { new: true })
			userRestoreProducer.sendMessage({
				id: user.id,
				deletionDate: user.deletionDate.toString(),
			})
		}

		// Store it on session object
		req.session = { jwt: userJwt }
		const userInfo = new UserSerializer(user)
			return res.status(userInfo.getStatusCode()).send( userInfo.serializeRest() )
		case Signup.OTP_EXPIRED:
			throw new OTPExpiredError()
		case Signup.OTP_INVALID_NUMBER:
			throw new OTPInvalidNumberError()
		default:
			throw new Error('Error while processing OTP')
	}
})

export default otpValidationRouter

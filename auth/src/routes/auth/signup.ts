import express, { Request, Response } from 'express'
import { validationResult } from 'express-validator'
import { User } from '../../models/index'
import { SIGNUP_ROUTE } from '../route_defs'
import {
	emailValidation,
	nameValidation,
	passwordValidation,
	profileImageValidation,
	schoolValidation,
} from '../../validations/signup_validation'
import { DuplicatedEmail, InvalidInput } from '../../errors'
import { GetUserInfo } from '../../events'
import { EmailSender } from '../../utils'

import { verifyOtp } from '../../utils/account_verification'

// signup -> database is store your user info -> sending verify meesage
// SignIn -> if you are not verify -> go to OTP page.
//
const signUpRouter = express.Router()
signUpRouter.post(
	SIGNUP_ROUTE,
	[...emailValidation, nameValidation, profileImageValidation, schoolValidation, ...passwordValidation],
	async (req: Request, res: Response) => {
		const errors = validationResult(req).array()

		if (errors.length > 0) throw new InvalidInput(errors)

		const { name, email, password, profileImage, school, type } = req.body

		let user = await User.findOne({ email: email })
		if (user) {
			if (user.verified) {
				throw new DuplicatedEmail()
			}
		} else {
			user = await User.create({
				email,
				password,
				name,
				profileImage,
				school,
				type,
			})
		}

		const userSignedUp = await new GetUserInfo(user)
		const emailSender = EmailSender.getInstance()
		const { status, hash } = await emailSender.sendSignUpVerificationEmail({
			name: user.name,
			toEmail: user.email,
		})

		return res.status(userSignedUp.getStatusCode()).json({ status, hash, ...userSignedUp.serializeRest() })
	},
)
signUpRouter.post(`${SIGNUP_ROUTE}/send_OTP`, [...emailValidation], async (req: Request, res: Response) => {
	const errors = validationResult(req).array()

	if (errors.length > 0) throw new InvalidInput(errors)

	const { email } = req.body

	const user = await User.findOne({ email: email })
	if (user) {
		if (user.verified) {
			throw new DuplicatedEmail()
		}
	} else {
		throw new Error('No User')
	}

	const userSignedUp = await new GetUserInfo(user)
	const emailSender = EmailSender.getInstance()
	const { status, hash } = await emailSender.sendSignUpVerificationEmail({
		name: user.name,
		toEmail: user.email,
	})

	return res.status(userSignedUp.getStatusCode()).json({ status, hash, ...userSignedUp.serializeRest() })
})
signUpRouter.post(`${SIGNUP_ROUTE}/verify_OTP`, async (req, res) => {
	try {
		const { otpHash, email, otpCode } = req.body
		const result = await verifyOtp({ otpHash, email, otpCode })
		if (result === 'Success') {
			await User.findOneAndUpdate({ email }, { verified: true })
			res.status(200).json({ message: result })
		} else if (result === 'OTP expired') {
			res.status(401).json({ message: result })
		} else if (result === 'Invalid Verfication number') {
			res.status(401).json({ message: result })
		}
	} catch (error) {
		res.status(400).json({ message: 'Error while sending OTP', data: error })
	}
})

export default signUpRouter

import express, { Request, Response } from 'express'
import { User } from '../models'
import { validationResult } from 'express-validator'
import { SEND_OTP_ROUTE } from './routes-def'
import {
	InvalidInput,
	DuplicatedEmail,
	emailValidation,
	validateRequest,
	UserNotFoundError,
} from '@uniplanet-lib/common'
import { sendVerificationEmail } from '../utils/send-verification-email'

const requestOTPRouter = express.Router()

requestOTPRouter.post(SEND_OTP_ROUTE, [...emailValidation], validateRequest, async (req: Request, res: Response) => {
	const errors = validationResult(req).array()
	if (errors.length > 0) throw new InvalidInput(errors)

	const { email } = req.body
	const user = await User.findOne({ email })
	if (!user) throw new UserNotFoundError()
	if (user.verified) throw new DuplicatedEmail()
	if(!user.email.endsWith('.edu')){
		return res.status(404).send({'error': 'Please use your school email to sign up. Or Contact with Admin for more information.'})
	}
	const { hash } = await sendVerificationEmail(user.email)

	return res.status(201).json({ hash })
})

export default requestOTPRouter

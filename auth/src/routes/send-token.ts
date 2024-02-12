import express, { Request, Response } from 'express'
import { User } from '../models'
import { validationResult } from 'express-validator'
import { SEND_OTP_ROUTE } from './routes-def'
import { InvalidInput, DuplicatedEmail, emailValidation, validateRequest } from '@uniplanet-lib/common'

const sendingTokenRouter = express.Router()

sendingTokenRouter.post(SEND_OTP_ROUTE, [...emailValidation], validateRequest, async (req: Request, res: Response) => {
	const errors = validationResult(req).array()
	if (errors.length > 0) throw new InvalidInput(errors)

	const { email } = req.body
	const user = await User.findOne({ email })
	if (!user) throw new Error('No User')
	if (user.verified) throw new DuplicatedEmail()

	// await sendVerificationEmail(user)

	return res.status(200).json('Message Sent')
})

export default sendingTokenRouter

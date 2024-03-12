import express from 'express'
import { User } from '../models/index'
import { EmailSender, UserNotFoundError, tokenValidation } from '@uniplanet-lib/common'
import { FORGGOTTEN_PASSWORD_ROUTE } from './routes-def'

const forgottenPasswordRouter = express.Router()

forgottenPasswordRouter.put(FORGGOTTEN_PASSWORD_ROUTE, tokenValidation, async (req, res) => {
	const { email } = req.body

	const existingUser = await User.findOne({ email })

	if (!existingUser) {
		throw new UserNotFoundError()
	}

	const emailSender = EmailSender.getInstance()
	const ResetPasswordRespond = await emailSender.sendPasswordResetEmail({ toEmail: email })

	await existingUser.updateOne({ password: ResetPasswordRespond.tempPassword })

	res.status(200).json({ message: 'Password updated successfully' })
})

export default forgottenPasswordRouter

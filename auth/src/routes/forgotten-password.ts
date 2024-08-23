import express from 'express'
import { User } from '../models/index'
import { generatePassword, UserNotFoundError } from '@uniplanet-lib/common'
import { FORGGOTTEN_PASSWORD_ROUTE } from './routes-def'
import { firebaseAdmin } from '..'
import { buildResetPasswordEmailBody, buildResetPasswordEmailHtml, buildResetPasswordEmailSubject } from '../config/reset-password-email-format'
import { sendResetPasswordEmail } from '../utils/send-reset-password-email'
const forgottenPasswordRouter = express.Router()

forgottenPasswordRouter.put(FORGGOTTEN_PASSWORD_ROUTE, async (req, res) => {
	const { email } = req.body

	const existingUser = await User.findOne({ email })

	if (!existingUser) {
		throw new UserNotFoundError()
	}

	const tempPassword = await sendResetPasswordEmail(email);

	await existingUser.updateOne({ password: tempPassword })

	res.status(200).json({ message: 'Password updated successfully' })
})

export default forgottenPasswordRouter


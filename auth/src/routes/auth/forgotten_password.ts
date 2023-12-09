import express from 'express'
import { User } from '../../models/index'
import { EmailSender } from '../../utils'

const forgottenPassword = express.Router()

forgottenPassword.put('/api/auth/forgotten_password', async (req, res) => {
	const { email } = req.body

	const existingUser = await User.findOne({ email })

	if (!existingUser) {
		return res.status(401).json({ message: "User with the given email address doesn't exists!" })
	}

	const emailSender = EmailSender.getInstance()
	const ResetPasswordRespond = await emailSender.sendPasswordResetEmail({ toEmail: email })

	await existingUser.updateOne({ password: ResetPasswordRespond.tempPassword })

	res.status(200).json({ message: 'Password updated successfully' })
})

export default forgottenPassword

import express from 'express'
import { User } from '../models/index'
import { EmailSender, UserNotFoundError } from '@uniplanet-lib/common'
import { FORGGOTTEN_PASSWORD_ROUTE } from './routes-def'
import admin from 'firebase-admin';
const forgottenPasswordRouter = express.Router()

forgottenPasswordRouter.put(FORGGOTTEN_PASSWORD_ROUTE, async (req, res) => {
	const { email } = req.body

	const existingUser = await User.findOne({ email })

	if (!existingUser) {
		throw new UserNotFoundError()
	}

	const emailSender = EmailSender.getInstance()
	admin
	.firestore()
	.collection("mail")
	.add({
	  to: "sije.park@gmail.com",
	  message: {
		subject: "Hello from Firebase!",
		text: "This is the plaintext section of the email body.",
		html: "This is the <code>HTML</code> section of the email body.",
	  },
	})
	.then(() => console.log("Queued email for delivery!"));
	const ResetPasswordRespond = await emailSender.sendPasswordResetEmail({ toEmail: email })

	await existingUser.updateOne({ password: ResetPasswordRespond.tempPassword })

	res.status(200).json({ message: 'Password updated successfully' })
})

export default forgottenPasswordRouter

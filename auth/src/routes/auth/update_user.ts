import express from 'express'
// import bcryptjs from 'bcryptjs';
import { User } from '../../models/index'
import auth from '../../middlewares/auth'
import { EmailSender } from '../../utils'

const updateUserRoute = express.Router()

updateUserRoute.post('api/password-update', auth, async (req, res) => {
	const { id, password } = req.body

	const updateUser = await User.findByIdAndUpdate(
		id,
		{
			$password: password,
		},
		{ new: true },
	)

	res.status(200).json(updateUser)
})

updateUserRoute.put('/api/forgottenPassword', async (req, res) => {
	try {
		const { email } = req.body
		console.log(email)
		const existingUser = await User.findOne({ email })

		if (!existingUser) {
			console.log('User Exists!')
			res.status(200).json({ message: "User with the given email address doesn't exists!" })
			return
		}

		const emailSender = EmailSender.getInstance()
		const ResetPasswordRespond = await emailSender.sendPasswordResetEmail(email)

		existingUser.password = ResetPasswordRespond.tempPassword

		await existingUser.save()

		res.status(200).json({ message: 'Password updated successfully' })
	} catch (error) {
		res.status(400).json({ message: 'Something went wrong' })
	}
})

export default updateUserRoute

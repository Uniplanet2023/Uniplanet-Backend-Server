import express from 'express'
import { User } from '../../models/index'
import auth from '../../middlewares/auth'

const passwordUpdateRouter = express.Router()

passwordUpdateRouter.post('/api/auth/password_update', auth, async (req, res) => {
	const { password } = req.body

	const updateUser = await User.findByIdAndUpdate(
		req.user,
		{
			password,
		},
		{ new: true },
	)

	res.status(200).json(updateUser)
})

export default passwordUpdateRouter

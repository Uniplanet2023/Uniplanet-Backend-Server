import express from 'express'
import { User } from '../models/index'
import { auth } from '@uniplanet-lib/common'
import { PASSWORD_UPDATE_ROUTE } from './routes-def'

const passwordUpdateRouter = express.Router()

passwordUpdateRouter.post(PASSWORD_UPDATE_ROUTE, auth, async (req, res) => {
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

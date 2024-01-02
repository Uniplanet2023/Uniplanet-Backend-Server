import express from 'express'
import { User } from '../models/index'
import { auth, tokenValidation } from '@uniplanet-lib/common'
import { DELETE_USER_ROUTE } from './routes_def'


const deleteUserRoute = express.Router()
deleteUserRoute.delete(DELETE_USER_ROUTE, tokenValidation, auth, async (req, res) => {
	// Delete User 7 days after
	const user = await User.findByIdAndUpdate(
		{ _id: req.user!.id },
		{ deletionDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) },
		{ new: true },
	)
	// TODO: Delete All the product, messages, userchat related to the User
	// await Product.findByIdAndUpdate(
	// 	{ seller: req.user!.id },
	// 	{ deletionDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) },
	// )
	if (user?.myChatRoom) {
		await Promise.all(
			user.myChatRoom.map(async myChatRoom => {
				await myChatRoom.$set({ deletionDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) })
			}),
		)
	}
	res.status(200).json('Account Successfully Deleted')
})
export default deleteUserRoute

import express from 'express'
import { User } from '../models/index'
import { UserNotFoundError, tokenValidation } from '@uniplanet-lib/common'
import { DELETE_USER_ROUTE } from './routes-def'
import { userDeletedProducer } from '..'

const deleteUserRouter = express.Router()
deleteUserRouter.delete(DELETE_USER_ROUTE, tokenValidation, async (req, res) => {
	const user = await User.findById( req.user!.id )
	if (!user) {
		throw new UserNotFoundError()
	}
	// Delete User 7 days after
	await User.findByIdAndUpdate(
		{ _id: user.id },
		{ deletionDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) },
		{ new: true },
	)
	req.session = null
	req.user = undefined;
	userDeletedProducer.sendMessage({
		id: user.id,
	})
	// TODO: Delete All the product, messages, userchat related to the User

	res.status(200).json('Account Successfully Deleted')
})
export default deleteUserRouter

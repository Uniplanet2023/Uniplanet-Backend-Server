import express from 'express'
import { User } from '../models/index'
import { UserNotFoundError, redisClient, tokenValidation } from '@uniplanet-lib/common'
import { DELETE_USER_ROUTE } from './routes-def'
import { userDeletedProducer } from '..'

const deleteUserRouter = express.Router()
deleteUserRouter.delete(DELETE_USER_ROUTE, tokenValidation, async (req, res) => {
	const user = await User.findById(req.user!.id)
	if (!user) {
		throw new UserNotFoundError()
	}
	const deletionDate = new Date()
	deletionDate.setDate(deletionDate.getDate() + 7) // Adds 7 days to the current date
	// Delete User 7 days after
	await User.findByIdAndUpdate({ _id: user.id }, { deletionDate: deletionDate }, { new: true })
	req.session = null
	req.user = undefined
	await redisClient.redis.del(user.id)
	await redisClient.redis.del(`Search Record: ${user.id}`)
	userDeletedProducer.sendMessage({
		id: user.id,
	})
	// TODO: Delete All the product, messages, userchat related to the User

	res.status(200).json({ message: 'Account Successfully Deleted' })
})
export default deleteUserRouter

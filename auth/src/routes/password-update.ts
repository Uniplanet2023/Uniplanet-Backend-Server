import express from 'express'
import { User } from '../models/index'
import { PasswordHash, PasswordMismatchError, tokenValidation } from '@uniplanet-lib/common'
import { PASSWORD_UPDATE_ROUTE } from './routes-def'

const passwordUpdateRouter = express.Router()

passwordUpdateRouter.put(PASSWORD_UPDATE_ROUTE, tokenValidation, async (req, res) => {
	const { password, newPassword } = req.body
	const user = await User.findById(req.user);
	if(!user){
		return res.status(404).json({message: 'User not found'})
	}

	// Compare passwords
	const isMatch = PasswordHash.compareSync({ providedPassword: password, storedPassword: user.password })
	if (!isMatch) throw new PasswordMismatchError()

	// Update password
	user.password = newPassword;
	await user.save();


	res.status(200).json({ message: 'Password updated successfully' });
})

export default passwordUpdateRouter

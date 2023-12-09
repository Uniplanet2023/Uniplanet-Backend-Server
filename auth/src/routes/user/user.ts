import express, { Request, Response } from 'express'
import auth from '../../middlewares/auth'
import { Product } from '../../models/index'
import { get } from '../../redis_controller/redis_controller'
import { getUserDataFunction } from '../../functions/user_data'
import { logStart, logEnd, handleError } from '../../functions/log_function'

const userRouter = express.Router()

// get user data
userRouter.get('/', auth, async (req: Request, res: Response) => {
	logStart('User Data Get API')
	try {
		console.log('1. Getting data from redis')

		const data = await get(req.token as string)

		if (data != null && data) {
			console.log('2. Sending data from Redis')
			const dataObj = JSON.parse(data)
			res.json({ ...dataObj._doc, token: req.token })
		} else {
			console.log('2. No Data From Redis')
			console.log('3. Search User From DB')
			const user = await getUserDataFunction(req.user as string)

			console.log('4. Sending User Data from DB')
			if (!user) {
				throw Error('No UserData')
			} else {
				const userObj = user.toObject()
				res.json({ ...userObj, token: req.token })
			}

			logEnd('User Data Get API')
		}
	} catch (e) {
		handleError(res, e as Error)
	}
})

// Delete the product
userRouter.post('/api/delete-product', auth, async (req: Request, res: Response) => {
	logStart('Delete Product API')
	try {
		const { id } = req.body
		console.log('1. Finding and Delete Product')
		const product = await Product.findByIdAndDelete(id)
		if (product) {
			console.log('2. Successfully Deleted')
		} else {
			console.log("2. Can't find Product or Couldn't Delete the Product")
		}
		res.json(product)
		logEnd('Delete Product API')
	} catch (e) {
		handleError(res, e as Error)
	}
})
export default userRouter

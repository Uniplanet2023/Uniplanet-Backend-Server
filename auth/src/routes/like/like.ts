import express, { Request, Response } from 'express'
import auth from '../../middlewares/auth'
import { User, Product } from '../../models/index' // Keep as is if Product is a named export

import { handleError } from '../../functions/log_function'

const likeRouter = express.Router()

likeRouter.post('/api/add-like', auth, async (req: Request, res: Response) => {
	// automatically guess req is which type
	try {
		const { id } = req.body
		const product = await Product.findById(id)
		let user = await User.findById(req.user)

		if (!user || !product) {
			res.status(404).send('User or Product not found')
			return
		}

		if (user.like.length === 0) {
			user.like.push(product)
		} else {
			let isProductFound = false
			for (let i = 0; i < user.like.length; i += 1) {
				if (user.like[i]._id.equals(product._id)) {
					isProductFound = true
				}
			}

			if (isProductFound) {
				user.like.find(productt => productt._id.equals(product._id))
			} else {
				user.like.push(product)
			}
		}
		user = await user.save()
		res.json(user)
	} catch (e) {
		handleError(res, e as Error)
	}
})

likeRouter.delete('/api/remove-from-like/:id', auth, async (req: Request, res: Response) => {
	try {
		const { id } = req.params
		const product = await Product.findById(id)
		let user = await User.findById(req.user)

		if (!user || !product) {
			res.status(404).send('User or Product not found')
			return
		}

		for (let i = 0; i < user.like.length; i += 1) {
			if (user.like[i]._id.equals(product._id)) {
			}
		}
		user = await user.save()
		res.json(user)
	} catch (e) {
		handleError(res, e as Error)
	}
})
export default likeRouter

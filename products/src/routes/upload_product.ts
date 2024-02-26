import express from 'express'
import Product from '../models/product'
import { UPLOAD_PRODUCT_ROUTE } from '../route_defs'
import { auth, tokenValidation } from '@uniplanet-lib/common'
import User from '../models/user'

const uploadProductRouter = express.Router()

// Add product
uploadProductRouter.post(`${UPLOAD_PRODUCT_ROUTE}`, tokenValidation, async (req, res) => {
	const { productName, forSale, description, images, price, category } = req.body
	let seller = User.build({
		email: req.user!.email,
		name: req.user!.name,
		school: req.user!.school,
		profileImage: req.user!.profileImage,
	})
	let product = new Product({
		productName,
		forSale,
		
		description,
		images,
		price,
		category,
	})
	product = await product.save()
	await product.populate('seller')
	return res.status(201).json(product)
})
export default uploadProductRouter

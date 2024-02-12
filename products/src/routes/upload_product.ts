import express from 'express'
import Product from '../models/product'
import { PRODUCT_ROUTE } from '../route_defs'
import { auth } from '@uniplanet-lib/common'

const uploadProductRouter = express.Router()

// Add product
uploadProductRouter.post(`${PRODUCT_ROUTE}/upload_product`, auth, async (req, res) => {
	const { productName, forSale, seller, description, images, price, category } = req.body

	let product = new Product({
		productName,
		forSale,
		seller,
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

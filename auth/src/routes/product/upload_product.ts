import express from 'express'
import { Product } from '../../models/index'
import auth from '../../middlewares/auth'
import { PRODUCT_ROUTE } from '../route_defs'
import { GetProductInfo } from '../../events'

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
	const productInfo = await new GetProductInfo(product)
	return res.status(productInfo.getStatusCode()).json(productInfo.serializeRest())
})
export default uploadProductRouter

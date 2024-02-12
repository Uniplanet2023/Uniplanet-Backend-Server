import express from 'express'
import Product from '../models/product'
import { PRODUCT_ROUTE } from '../route_defs'


const searchProductRouter = express.Router()

searchProductRouter.get(`${PRODUCT_ROUTE}/search/:productName`, async (req, res) => {
	const { productName } = req.params
	const products = await Product.find({
		productName: { $regex: productName.trim(), $options: 'i' },
	}).populate('seller')
	

	return res.status(201).json(products)
})

export default searchProductRouter

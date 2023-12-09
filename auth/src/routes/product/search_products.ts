import express from 'express'
import { Product } from '../../models/index'
import { PRODUCT_ROUTE } from '../route_defs'
import { GetProductsInfo } from '../../events'

const searchProductRouter = express.Router()

searchProductRouter.get(`${PRODUCT_ROUTE}/search/:productName`, async (req, res) => {
	const { productName } = req.params
	const products = await Product.find({
		productName: { $regex: productName.trim(), $options: 'i' },
	}).populate('seller')
	const productsInfo = await new GetProductsInfo(products)
	return res.status(productsInfo.getStatusCode()).json(productsInfo.serializeRest())
})

export default searchProductRouter

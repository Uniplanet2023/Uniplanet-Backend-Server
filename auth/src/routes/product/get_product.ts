import express, { Request, Response } from 'express'
import { Product } from '../../models/index'
import { PRODUCT_ROUTE } from '../route_defs'
import GetProductsInfo from '../../events/get_products_info'
const getRecentProductRouter = express.Router()

getRecentProductRouter.get(`${PRODUCT_ROUTE}`, async (req: Request, res: Response) => {
	const category = req.query.category ? { category: req.query.category } : {}
	const products = await Product.find(category).populate('seller')

	const productsInfo = new GetProductsInfo(products)
	res.status(productsInfo.getStatusCode()).json(productsInfo.serializeRest())
})
export default getRecentProductRouter

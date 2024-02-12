import express, { Request, Response } from 'express'
import Product from '../models/product'
import { PRODUCT_ROUTE } from '../route_defs'

const getRecentProductRouter = express.Router()

getRecentProductRouter.get(`${PRODUCT_ROUTE}`, async (req: Request, res: Response) => {
	const category = req.query.category ? { category: req.query.category } : {}
	const products = await Product.find(category).populate('seller')

	
	res.status(201).json(products)
})
export default getRecentProductRouter

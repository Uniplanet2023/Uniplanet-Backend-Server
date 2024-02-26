import express, { Request, Response } from 'express'
import Product from '../models/product'
import { GET_PRODUCT_ROUTE } from '../route_defs'
import { tokenValidation } from '@uniplanet-lib/common'

const getRecentProductRouter = express.Router()

getRecentProductRouter.get(`${GET_PRODUCT_ROUTE}`, 
// tokenValidation,
 async (req: Request, res: Response) => {
	
    const category = req.query.category ?? {}
	// Store User in the database
    // Implement pagination in the query
    const products = await Product.find( {category,page: req.query.page})
                                   .populate('seller')
                                   
	
	  // Optionally, return total count for clients to calculate total pages
	  const totalCount = await Product.countDocuments({category});

	  res.status(200).json({
		  products,
		  totalCount,
		  totalPages: Math.ceil(totalCount / 10)
	  });
})
export default getRecentProductRouter

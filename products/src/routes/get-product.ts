import express, { Request, Response } from 'express'
import Product from '../models/product'
import { GET_PRODUCT_ROUTE } from '../route_defs'
import { tokenValidation } from '@uniplanet-lib/common'
import GetProductsInfo from '../event/serializer/get-products-info'

const getRecentProductRouter = express.Router()

getRecentProductRouter.get(GET_PRODUCT_ROUTE, 
tokenValidation,
 async (req: Request, res: Response) => {
	const pageNumber = parseInt(req.query.page as string);
	if(pageNumber < 0){
		throw new Error('Invalid page number');
	}
	const page = parseInt(req.query.page as string) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;

    // Build the query conditionally based on whether a category is provided
    let queryCondition = {};
    if (req.query.category) {
        queryCondition = { category: req.query.category };
    }

	// Store User in the database
    // Implement pagination in the query
    const products = await Product.find( queryCondition )
                                   .populate('seller')
								   .skip(skip)
								   .limit(10)
								   .sort({ createdAt: -1 });
                                   
	const productList = new GetProductsInfo(products);
	console.log(productList.serializeRest());
	
	res.status(productList.getStatusCode()).send(JSON.stringify(productList.serializeRest()));
})
export default getRecentProductRouter

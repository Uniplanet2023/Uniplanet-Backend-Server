import express, { Request, Response } from 'express';
import Product from '../models/product';
import { tokenValidation } from '@uniplanet-lib/common';
import GetProductInfo from '../event/serializer/get-product-info';
import { UPDATE_PRODUCT_ROUTE } from '../route_defs';

const updateProductRouter = express.Router();

updateProductRouter.put(UPDATE_PRODUCT_ROUTE, tokenValidation, async (req: Request, res: Response) => {
    const { productId } = req.params;
    const { productName, status, description, images, price, category } = req.body;
    
    try {
        const product = await Product.findById(productId);
    
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }
        
        // Update product details
        product.productName = productName ?? product.productName;
        product.status = status ?? product.status;
        product.description = description ?? product.description;
        product.images = images ?? product.images;
        product.price = price ?? product.price;
        product.category = category ?? product.category;
        
        await product.save();
        await product.populate('seller'); // Re-populate seller if necessary
        const productData =new GetProductInfo(product);
        return res.status(productData.getStatusCode()).json(productData.serializeRest());
    } catch (error) {
        res.status(500).json({ error: 'Internal server error', details: error });
    }
});

export default updateProductRouter;

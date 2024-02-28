import express, { Request, Response } from 'express';
import Product from '../models/product';
import { UPLOAD_PRODUCT_ROUTE } from '../route_defs';
import { tokenValidation } from '@uniplanet-lib/common';
import User from '../models/user';
import GetProductInfo from '../event/serializer/get-product-info';

const uploadProductRouter = express.Router();

interface ProductRequestBody {
  productName: string;
  status: string;
  description: string;
  price: number;
  category: string;
}

// Helper function to create and save a new product
async function createAndSaveProduct(details: ProductRequestBody, sellerId: string) {
  const product = new Product({ ...details, seller: sellerId });
  await product.save();
  await product.populate('seller');
  return product;
}

uploadProductRouter.post(UPLOAD_PRODUCT_ROUTE, tokenValidation, async (req: Request, res: Response) => {
	
    const { productName, status, description, price, category } = req.body as ProductRequestBody;
    
    // Validate required fields
    if (!productName || !description || !price || !category) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    let seller = await User.findOne({ email: req.user!.email });
    if (!seller) {
      // If seller doesn't exist, create a new one
      seller = new User({
        email: req.user!.email,
        name: req.user!.name,
        school: req.user!.school,
        profileImage: req.user!.profileImage,
      });
      await seller.save();
    }

    const productDetails = { productName, status, description, price, category };
    const product = await createAndSaveProduct(productDetails, seller._id);

	  const productData =new GetProductInfo(product);
    
    return res.status(productData.getStatusCode()).json(productData.serializeRest());
  
});

export default uploadProductRouter;

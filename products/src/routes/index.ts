import express from 'express'

import getRecentProductRouter from './get-product'
import searchProductRouter from './search_products'
import uploadProductRouter from './upload-product'
import updateProductRouter from './update-product'

const productRouter = express.Router()

productRouter.use(updateProductRouter)
productRouter.use(uploadProductRouter)
productRouter.use(getRecentProductRouter)
productRouter.use(searchProductRouter)

export default productRouter

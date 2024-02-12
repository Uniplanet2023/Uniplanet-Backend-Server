import express from 'express'

import getRecentProductRouter from './get_product'
import searchProductRouter from './search_products'
import uploadProductRouter from './upload_product'

const productRouter = express.Router()

productRouter.use(uploadProductRouter)
productRouter.use(getRecentProductRouter)
productRouter.use(searchProductRouter)

export default productRouter

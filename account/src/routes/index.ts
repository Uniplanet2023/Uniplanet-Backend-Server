import express from 'express'
import accountInfoRouter from './get-account-info'
import updateNameRouter from './update-name'
import updateProfileRouter from './update-profile'

const accountRouter = express.Router()
accountRouter.use(updateProfileRouter)
accountRouter.use(updateNameRouter)
accountRouter.use(accountInfoRouter)

export default accountRouter

import express from 'express'
import accountInfoRouter from './get-account-info'
import updateNameRouter from './update-name'
import updateProfileRouter from './update-profile'
import searchHistoryRouter from './get-search-history'

const accountRouter = express.Router()

accountRouter.use(searchHistoryRouter)
accountRouter.use(updateProfileRouter)
accountRouter.use(updateNameRouter)
accountRouter.use(accountInfoRouter)

export default accountRouter

import express from 'express'
import accountInfoRouter from './get-account-info'
import updateNameRouter from './update-name'
import updateProfileRouter from './update-profile'
import searchHistoryRouter from './get-search-history'
import deleteSearchHistoryRouter from './delete-search-history'
import deleteAllSearchHistoryRouter from './delete-all-search-history'
import updateNotificationRouter from './update-notification'

const accountRouter = express.Router()

accountRouter.use(updateNotificationRouter)
accountRouter.use(deleteAllSearchHistoryRouter)
accountRouter.use(deleteSearchHistoryRouter)
accountRouter.use(searchHistoryRouter)
accountRouter.use(updateProfileRouter)
accountRouter.use(updateNameRouter)
accountRouter.use(accountInfoRouter)

export default accountRouter

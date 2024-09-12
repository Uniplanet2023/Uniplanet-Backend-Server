import express from 'express'
import accountInfoRouter from './get-account-info'
import updateNameRouter from './update-name'
import updateProfileRouter from './update-profile'
import searchHistoryRouter from './get-search-history'
import deleteSearchHistoryRouter from './delete-search-history'
import deleteAllSearchHistoryRouter from './delete-all-search-history'
import reportUser from './report-user'
import advertiserInfoRouter from './get-advertiser-info'
import adStatisticRouter from './get-ad-statistic'
import adInteractionRouter from './get-ad-interaction'
import advertiserListRouter from './get-advertiser-list'
import increaseCreditRouter from './increase-credit-admin'
import blockRouter from './user-bloc-controll'
import getStripePublicKeyRouter from './payment-config'
import getStripeClientSecret from './create-payment-intent'
import increaseCreditRequestRouter from './increase-credit-request'
import bannerAdRouter from './banner/get-banner-ad'
import sendMailRouter from './mail/send-admail'

const accountRouter = express.Router()

accountRouter.use(sendMailRouter)
accountRouter.use(bannerAdRouter)
accountRouter.use(increaseCreditRequestRouter)
accountRouter.use(getStripeClientSecret)
accountRouter.use(getStripePublicKeyRouter)
accountRouter.use(blockRouter)
accountRouter.use(increaseCreditRouter)
accountRouter.use(advertiserListRouter)
accountRouter.use(adInteractionRouter)
accountRouter.use(adStatisticRouter)
accountRouter.use(advertiserInfoRouter)
accountRouter.use(reportUser)
accountRouter.use(deleteAllSearchHistoryRouter)
accountRouter.use(deleteSearchHistoryRouter)
accountRouter.use(searchHistoryRouter)
accountRouter.use(updateProfileRouter)
accountRouter.use(updateNameRouter)
accountRouter.use(accountInfoRouter)

export default accountRouter

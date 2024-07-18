import express, { Request, Response } from 'express'
import { tokenValidation } from '@uniplanet-lib/common'
import Report from '../models/report'
import Account from '../models/account'
import { GET_STRIPE_PUBLIC_KEY } from './routes-def'

const getStripePublicKeyRouter = express.Router()

getStripePublicKeyRouter.post(GET_STRIPE_PUBLIC_KEY, async (req: Request, res: Response) => {
	return res.status(201).send({ stripePublicKey: process.env.STRIPE_TEST_PUBLIC_KEY })
})

export default getStripePublicKeyRouter

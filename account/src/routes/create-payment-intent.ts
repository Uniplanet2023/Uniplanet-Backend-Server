import express, { Request, Response } from 'express'
import { stripe } from '../app'
import { GET_PAYMENT_INTENT } from './routes-def'
import jwt from 'jsonwebtoken'
import { tokenValidation } from '@uniplanet-lib/common'
const getStripeClientSecret = express.Router()

getStripeClientSecret.post(GET_PAYMENT_INTENT, tokenValidation, async (req: Request, res: Response) => {
	const { creditValue } = req.body
	if (!creditValue) {
		return res.status(400).send({ error: 'Credit value is required' })
	}
	const paymentIntent = await stripe.paymentIntents.create({
		amount: parseFloat(creditValue), // Ensure amount is in cents
		currency: 'usd',
		automatic_payment_methods: {
			enabled: true,
		},
	})
	const paymentIntentJwt = await jwt.sign(
		{ id: req.user!.id, paymentIntentId: paymentIntent.id, creditValue },
		process.env.JWT_TOKEN_SECRET as string,
		{ expiresIn: '30m' },
	)
	return res.status(201).send({
		clientSecret: paymentIntent.client_secret,
		token: paymentIntentJwt,
	})
})

export default getStripeClientSecret

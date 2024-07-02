import express, { Request, Response } from 'express';
import { GET_PAYMENT_INTENT } from './routes-def';
import { stripe } from '../app';

const getStripePublicKeyRouter = express.Router();

getStripePublicKeyRouter.post(GET_PAYMENT_INTENT, async (req: Request, res: Response) => {
    const paymentIntent = await stripe.paymentIntents.create({
        amount: 1099,
        currency: 'usd',
        automatic_payment_methods: {
            enabled: true,
        },
    });
  return res.status(201).send({clientSecret: paymentIntent.client_secret});
});

export default getStripePublicKeyRouter;
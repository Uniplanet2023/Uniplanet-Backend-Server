import express from 'express'
import 'express-async-errors'
import { errorHandler, NotFoundError, URL_LIST_DEV, URL_LIST_PROD } from '@uniplanet-lib/common'
import cors from 'cors'
import cookieSession from 'cookie-session'
import dotenv from 'dotenv-safe'
import accountRouter from './routes'
import Stripe from 'stripe'

if (process.env.NODE_ENV! == 'development') {
	dotenv.config({
		path: '.env.dev',
	})
}



export const stripe = new Stripe(process.env.STRIPE_TEST_SECRET_KEY!);
	
const app = express()
app.set('trust proxy', true) // proxy ingress nginx

const allowedOrigins = process.env.DEVELOPMENT_MODE === 'production' ? URL_LIST_PROD : URL_LIST_DEV;

// middleware
app.use(express.json())
app.use(
	cors({
		origin: (origin, callback) => {
			if (allowedOrigins.includes(origin!) || !origin) {
			  callback(null, true);
			} else {
				console.log('origin', origin)
			  callback(new Error('Not allowed by CORS'));
			}
		  },
		methods: ['GET', 'POST', 'PUT', 'DELETE'],
		credentials: true,
		optionsSuccessStatus: 204,
	}),
)
app.use(
	cookieSession({
		name: 'session',
		signed: process.env.DEVELOPMENT_MODE == 'production',
		keys: [process.env.COOKIE_SESSION_KEY!],
		secure: process.env.DEVELOPMENT_MODE == 'production',
		sameSite: 'lax',
		domain: process.env.DEVELOPMENT_MODE == 'production' ? '.uniplanet.shop' : '.uniplanet-back.auto',
	}),
)
app.use(accountRouter)
app.all('*', () => {
	throw new NotFoundError()
})
app.use(errorHandler)

export default app

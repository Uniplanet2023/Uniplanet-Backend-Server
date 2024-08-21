//eslint-disable-next-line import/no-extraneous-dependencies
import express from 'express'
import 'express-async-errors'
import { errorHandler, NotFoundError, URL_LIST_DEV, URL_LIST_PROD } from '@uniplanet-lib/common'
import cors from 'cors'
import cookieSession from 'cookie-session'
import dotenv from 'dotenv-safe'

if (process.env.NODE_ENV! == 'development') {
	dotenv.config({
		path: '.env.dev',
	})
}

import userRouter from './routes'
const app = express()
app.set('trust proxy', true) // proxy ingress nginx

// middleware
app.use(express.json())

const allowedOrigins = process.env.DEVELOPMENT_MODE === 'production' ? URL_LIST_PROD : URL_LIST_DEV
app.use(
	cors({
		origin: (origin, callback) => {
			if (!origin || allowedOrigins.includes(origin)) {
				callback(null, true)
			} else {
				callback(new Error('Not allowed by CORS'))
			}
		},
		methods: ['GET', 'POST', 'PUT', 'DELETE'],
		credentials: true,
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
app.use(userRouter)
app.all('*', () => {
	throw new NotFoundError()
})
app.use(errorHandler)

export default app

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

// IMPORTS FROM OTHER FILES
import accountRouter from './routes'
const app = express()
app.set('trust proxy', true) // proxy ingress nginx

// middleware
app.use(express.json())
app.use(
	cors({
		origin: process.env.SMTP_MODE == 'google' ? URL_LIST_PROD : URL_LIST_DEV,
		credentials: true,
	}),
)
app.use(
	cookieSession({
		signed: process.env.SMTP_MODE == 'google',
		keys: [process.env.COOKIE_SESSION_KEY!],
		secure: process.env.SMTP_MODE == 'google',
		sameSite: 'lax',
		domain: '.uniplanet-back.autos',
	}),
)
app.use(cors())
app.use(accountRouter)
app.all('*', () => {
	throw new NotFoundError()
})
app.use(errorHandler)

export default app

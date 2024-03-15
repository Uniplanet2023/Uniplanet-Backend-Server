import express from 'express'
import 'express-async-errors'
import { errorHandler, NotFoundError, URL_LIST_PROD } from '@uniplanet-lib/common'
import dotenv from 'dotenv-safe'
import cors from 'cors'
import cookieSession from 'cookie-session'

if (process.env.NODE_ENV! == 'development') {
	dotenv.config({
		path: '.env.dev',
	})
}

// IMPORTS FROM OTHER FILES
const app = express()
app.set('trust proxy', true) // proxy ingress nginx
app.use(cors({
	origin: URL_LIST_PROD,
	credentials:true
}))
app.use(
	cookieSession({
		signed: process.env.SMTP_MODE == 'google',
		keys: [process.env.COOKIE_SESSION_KEY!],
		secure: process.env.SMTP_MODE == 'google',
		sameSite:'lax',
		domain: '.uniplanet-back.autos'
	}),
)
app.all('*', () => {
	throw new NotFoundError()
})
app.use(errorHandler)

export default app

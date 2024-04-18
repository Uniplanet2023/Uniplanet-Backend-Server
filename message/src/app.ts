import express from 'express'
import 'express-async-errors'
import { errorHandler, NotFoundError, URL_LIST_DEV, URL_LIST_PROD } from '@uniplanet-lib/common'
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
app.use(
	cors({
		origin: process.env.DEVELOPMENT_MODE == 'production' ? URL_LIST_PROD : URL_LIST_DEV,
		credentials: true,
	}),
)

app.all('*', () => {
	throw new NotFoundError()
})
app.use(errorHandler)

export default app

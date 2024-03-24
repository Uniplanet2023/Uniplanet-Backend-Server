import express from 'express'
import 'express-async-errors'
import { errorHandler, NotFoundError, URL_LIST_DEV, URL_LIST_PROD } from '@uniplanet-lib/common'
import cors from 'cors'
import cookieSession from 'cookie-session'
// import dotenv from 'dotenv-safe'

// if (process.env.NODE_ENV! == 'development') {
// 	dotenv.config({
// 		path: '.env.dev',
// 	})
// }

// IMPORTS FROM OTHER FILES
import chatRouter from './routes'
const app = express()
app.set('trust proxy', true) // proxy ingress nginx

// middleware
app.use(express.json())
app.use(cors({
	origin: process.env.DEVELOPMENT_MODE == 'production' ? URL_LIST_PROD : URL_LIST_DEV,
	credentials:true
}))
app.use(
	cookieSession({
		signed: process.env.DEVELOPMENT_MODE == 'production',
		keys: [process.env.COOKIE_SESSION_KEY!],
		secure: process.env.DEVELOPMENT_MODE == 'production',
		sameSite:'lax',
		domain: process.env.DEVELOPMENT_MODE == 'production' ? '.uniplanet-back.autos' : '.uniplanet-back.auto',
	}),
)
app.use(chatRouter)
app.all('*', () => {
	throw new NotFoundError()
})
app.use(errorHandler)

export default app

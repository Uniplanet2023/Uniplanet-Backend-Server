import express from 'express'
import 'express-async-errors'
import { errorHandler, NotFoundError } from '@uniplanet-lib/common'
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
	origin:['https://auth.uniplanet-back.autos','https://products.uniplanet-back.autos',
	'https://account.uniplanet-back.autos','https://chat.uniplanet-back.autos'],
	credentials:true
}))
app.use(
	cookieSession({
		signed: true,
		secure: true,
		keys: [process.env.COOKIE_SESSION_KEY!],
		sameSite:'lax',
		domain: '.uniplanet-back.autos'
	}),
)
app.all('*', () => {
	throw new NotFoundError()
})
app.use(errorHandler)

export default app

import express from 'express'
import 'express-async-errors'
import { errorHandler, NotFoundError } from '@uniplanet-lib/common'
import cors from 'cors'
import cookieSession from 'cookie-session'
import dotenv from 'dotenv-safe'

// if (process.env.NODE_ENV! == 'development') {
// 	dotenv.config({
// 		path: '.env.dev',
// 	})
// }

// IMPORTS FROM OTHER FILES
import userRouter from './routes'
const app = express()
app.set('trust proxy', true) // proxy ingress nginx

// middleware
app.use(express.json())
app.use(cors({
	origin:['http://auth.uniplanet-back.autos','http://products.uniplanet-back.autos'],
	credentials:true
}))
app.use(
	cookieSession({
		signed: false,
		secure: false,
		sameSite:'lax',
		domain: '.uniplanet-back.autos'
	}),
)
app.use(cors())
app.use(userRouter)
app.all('*', () => {
	throw new NotFoundError()
})
app.use(errorHandler)

export default app

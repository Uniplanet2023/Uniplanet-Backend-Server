import express from 'express'
import 'express-async-errors'
import { errorHandler } from '@uniplanet-lib/common'
import cors from 'cors'
// import dotenv from 'dotenv-safe'
import cookieSession from 'cookie-session'

const parsedNodeEnv = process.env.NODE_ENV || 'example'

// console.log(parsedNodeEnv.trim() === 'production' ? '.env.production' : 'development' ? '.env.dev' : '.env.example')
// dotenv.config({
// 	path: parsedNodeEnv.trim() === 'production' ? '.env.production' : 'development' ? '.env.dev' : '.env.example',
// })
console.log('test');
// IMPORTS FROM OTHER FILES
import { default as productRouter } from './routes'

import { NotFoundError } from '@uniplanet-lib/common'

const app = express()
app.set('trust proxy', true) // proxy ingress nginx
// middleware
app.use(express.json())
app.use(
	cookieSession({
		signed: false,
		secure: process.env.NODE_ENV !== 'test',
	}),
)
app.use(cors())
app.use(productRouter)

app.all('*', () => {
	throw new NotFoundError()
})
app.use(errorHandler)

export default app

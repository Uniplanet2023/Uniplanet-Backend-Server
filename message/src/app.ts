import express from 'express'
import 'express-async-errors'
import { errorHandler, NotFoundError } from '@uniplanet-lib/common'
import dotenv from 'dotenv-safe'

if (process.env.NODE_ENV! == 'development') {
	dotenv.config({
		path: '.env.dev',
	})
}

// IMPORTS FROM OTHER FILES
const app = express()
app.set('trust proxy', true) // proxy ingress nginx

app.all('*', () => {
	throw new NotFoundError()
})
app.use(errorHandler)

export default app

import express from 'express'
import { errorHandler, kafkaClient, NotFoundError, URL_LIST_DEV, URL_LIST_PROD } from '@uniplanet-lib/common'
import cors from 'cors'
import 'express-async-errors'
import { initializeProducer, initializeRedis} from './config'

const { PORT = 3004 } = process.env
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

const server = app.listen(PORT, async () => {
	console.log(`BackEnd Connection : BackEnd Server connected at port ${PORT}`)
	await initializeProducer(kafkaClient.kafka);
	await initializeRedis();
})

export default server

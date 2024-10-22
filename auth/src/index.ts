import mongoose from 'mongoose'
import app from './app'
import { UserDeleteScheduler } from './scheduler'
import { secretCheck } from './secret-check'
import { EmailSender, NodemailerEmailApi, kafkaClient, redisClient } from '@uniplanet-lib/common'
import { UserCreatedProducer, UserRestoreProducer } from './events'
import { UserDeletedProducer } from './events/producer/user-deleteted'
import { initializeFirebase } from './config/firebase'

const { PORT = 3000, NODE_ENV, KAFKA_BROKER, MONGO_DB_HOST, DEVELOPMENT_MODE } = process.env

const emailSender = EmailSender.getInstance()
emailSender.activate()
emailSender.setEmailApi(new NodemailerEmailApi())

export const firebaseAdmin = initializeFirebase()
// Creating and configuring Kafka client
if (NODE_ENV === 'production') {
	if (!KAFKA_BROKER) {
		throw new Error('KAFKA_BROKER have to be define')
	}
	kafkaClient.create('my-app', [process.env.KAFKA_BROKER! as string])
}

export const userCreatedProducer = new UserCreatedProducer(kafkaClient.kafka)
export const userDeletedProducer = new UserDeletedProducer(kafkaClient.kafka)
export const userRestoreProducer = new UserRestoreProducer(kafkaClient.kafka)

app.listen(PORT, async () => {
	console.log(`BackEnd Connection : BackEnd Server connected at port ${PORT}`)

	secretCheck()
	if (process.env.NODE_ENV == 'production') {
		await userCreatedProducer.connect()
		await userDeletedProducer.connect()
		await userRestoreProducer.connect()
	}

	await mongoose.connect(`${MONGO_DB_HOST as string}`).then(async () => {
		console.log('MongoDB is connected')
		new UserDeleteScheduler().taskInitializer()
		await redisClient.create(process.env.REDIS_HOST!, parseInt(process.env.REDIS_PORT!))
		redisClient.redis.on('error', err => console.log('Redis Client Error', err))
		await redisClient.redis.connect().then(() => {
			console.log('Redis is connected')
		})
	})
})

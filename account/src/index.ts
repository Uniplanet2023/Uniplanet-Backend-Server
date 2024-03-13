import mongoose from 'mongoose'
import app from './app'

// import { secretCheck } from './secret-check'
import UserCreatedConsumer from './event/consumer/UserCreatedConsumer'
import { kafkaClient, redisClient } from '@uniplanet-lib/common'

const PORT = process.env.PORT || 3002

app.listen(PORT, async () => {
	console.log(`BackEnd Connection : BackEnd Server connected at port ${PORT}`)

	// secretCheck()
	if (process.env.NODE_ENV == 'production') {
		console.log('Kafka Broker', process.env.KAFKA_BROKER!)
		kafkaClient.create('my-app', [process.env.KAFKA_BROKER! as string])
		const userCreatedConsumer = new UserCreatedConsumer(kafkaClient.kafka, 'usercreated')
		await userCreatedConsumer.connect()
	}
	await redisClient.create(process.env.REDIS_HOST!, parseInt(process.env.REDIS_PORT!))
	redisClient.redis.on('error', err => console.log('Redis Client Error', err))
	await redisClient.redis.connect().then(() => {
		console.log('Redis is connected')
	})

	await mongoose.connect(`${process.env.MONGO_DB_HOST as string}`).then(() => {
		console.log('MongoDB is connected')
	})
})

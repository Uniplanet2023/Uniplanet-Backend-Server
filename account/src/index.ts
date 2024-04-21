import mongoose from 'mongoose'
import app from './app'

// import { secretCheck } from './secret-check'
import UserCreatedConsumer from './event/consumer/user-created'
import { kafkaClient, redisClient } from '@uniplanet-lib/common'
import { UserUpdateProducer } from './event/producer/UserUpdateProducer'
import { v2 as cloudinary } from 'cloudinary'
import UserDeletedConsumer from './event/consumer/user-deleted'

cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
})

export const cloudinaryAPI = cloudinary;
const PORT = process.env.PORT || 3002
kafkaClient.create('my-app', [process.env.KAFKA_BROKER! as string])
export const userUpdateProducer = new UserUpdateProducer(kafkaClient.kafka);

app.listen(PORT, async () => {
	console.log(`BackEnd Connection : BackEnd Server connected at port ${PORT}`)

	// secretCheck()
	if (process.env.NODE_ENV == 'production') {
		console.log('Kafka Broker', process.env.KAFKA_BROKER!)
		
		const userCreatedConsumer = new UserCreatedConsumer(kafkaClient.kafka, 'usercreated')
		const userDeletedConsumer = new UserDeletedConsumer(kafkaClient.kafka, 'userdeleted')
		await userCreatedConsumer.connect()
		await userUpdateProducer.connect();
		await userDeletedConsumer.connect()
	}
	

	await mongoose.connect(`${process.env.MONGO_DB_HOST as string}`).then(async () => {
		console.log('MongoDB is connected')
		await redisClient.create(process.env.REDIS_HOST!, parseInt(process.env.REDIS_PORT!))
		redisClient.redis.on('error', err => console.log('Redis Client Error', err))
		await redisClient.redis.connect().then(() => {
			console.log('Redis is connected')
		})
	})
})

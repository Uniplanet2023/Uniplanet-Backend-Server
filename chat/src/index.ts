import app from './app'
import { kafkaClient } from '@uniplanet-lib/common'
import { v2 as cloudinary } from 'cloudinary'
import { initializeFirebase, initializeKafkaConsumer, initializeMongooseWithScheduler, initializeProducer, initializeRedis } from './config'
import { CreateChatProducer } from './event/producer/create_chat'
import { UserUpdateProducer } from './event/producer/user-update'

const { PORT = 3003, NODE_ENV, KAFKA_BROKER } = process.env


cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
})

export const cloudinaryAPI = cloudinary
kafkaClient.create('my-app', [process.env.KAFKA_BROKER! as string]);
export const createChatProducer = new CreateChatProducer(kafkaClient.kafka)
export const userUpdateProvider = new UserUpdateProducer(kafkaClient.kafka)

app.listen(PORT, async () => {
	console.log(`BackEnd Connection : BackEnd Server connected at port ${PORT}`)
	if (NODE_ENV === 'production') {
		if (!KAFKA_BROKER) {
			throw new Error('KAFKA_BROKER have to be define')
		}
		
		// Kafka Consumer
		await initializeKafkaConsumer();		
		// Kafka Producer
		await initializeProducer();
		// Firebase
		initializeFirebase();
		// Redis
		await initializeRedis();
		// Mongoose
		await initializeMongooseWithScheduler();
	}
})

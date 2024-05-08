import mongoose from 'mongoose'
import app from './app'
import { kafkaClient } from '@uniplanet-lib/common'
import { v2 as cloudinary } from 'cloudinary'
import MessageCreatedConsumer from './event/consumer/message_receive'
import MessageReadAllConsumer from './event/consumer/message_read_all'
import { CreateChatProducer } from './event/producer/create_chat'
import UserUpdateConsumer from './event/consumer/user-update-Consumer'
import UserDeletedConsumer from './event/consumer/user-deleted'
import DeleteScheduler from './scheduler/delete-scheduler'
import { UserUpdateProducer } from './event/producer/user-update'

const { PORT = 3003, NODE_ENV, KAFKA_BROKER, MONGO_DB_HOST } = process.env

kafkaClient.create('my-app', [process.env.KAFKA_BROKER! as string])
cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
})

export const cloudinaryAPI = cloudinary
export const createChatProducer = new CreateChatProducer(kafkaClient.kafka)
export const userUpdateProvider = new UserUpdateProducer(kafkaClient.kafka)

app.listen(PORT, async () => {
	console.log(`BackEnd Connection : BackEnd Server connected at port ${PORT}`)
	if (NODE_ENV === 'production') {
		if (!KAFKA_BROKER) {
			throw new Error('KAFKA_BROKER have to be define')
		}
		const messageCreatedConsumer = new MessageCreatedConsumer(kafkaClient.kafka, 'messagecreated')
		const messageReadAllConsumer = new MessageReadAllConsumer(kafkaClient.kafka, 'messageread')
		const userUpdateConsumer = new UserUpdateConsumer(kafkaClient.kafka, 'userupdate')
		const userDeletedConsumer = new UserDeletedConsumer(kafkaClient.kafka, 'userdeleted-chat')

		// Consumer
		await messageReadAllConsumer.connect()
		await messageCreatedConsumer.connect()
		await userUpdateConsumer.connect()
		await userDeletedConsumer.connect()
		// Producer
		await createChatProducer.connect()
		await userUpdateProvider.connect()
	}

	await mongoose.connect(`${MONGO_DB_HOST as string}`).then(() => {
		console.log('MongoDB is connected')
		new DeleteScheduler().taskInitializer();
	})
})

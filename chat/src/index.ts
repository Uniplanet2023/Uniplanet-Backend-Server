import mongoose from 'mongoose'
import app from './app'
import { secretCheck } from './secret-check'
import { EmailSender, NodemailerEmailApi, kafkaClient, redisClient } from '@uniplanet-lib/common'

import MessageCreatedConsumer from './event/consumer/message_receive'
import MessageReadAllConsumer from './event/consumer/message_read_all'
import { CreateChatProducer } from './event/producer/create_chat'
import UserUpdateConsumer from './event/consumer/user-update-Consumer'

const { PORT = 3003, NODE_ENV, KAFKA_BROKER, MONGO_DB_HOST } = process.env

kafkaClient.create('my-app', [process.env.KAFKA_BROKER! as string])

export const createChatProducer = new CreateChatProducer(kafkaClient.kafka);		

app.listen(PORT, async () => {
	console.log(`BackEnd Connection : BackEnd Server connected at port ${PORT}`)
	if (NODE_ENV === 'production') {
		if (!KAFKA_BROKER) {
			throw new Error('KAFKA_BROKER have to be define')
		}
		const messageCreatedConsumer = new MessageCreatedConsumer(kafkaClient.kafka, 'messagecreated')
		const messageReadAllConsumer = new MessageReadAllConsumer(kafkaClient.kafka, 'messageread')
		const userUpdateConsumer = new UserUpdateConsumer(kafkaClient.kafka, 'userupdate');
		

		// Consumer
		await messageReadAllConsumer.connect()
		await messageCreatedConsumer.connect()
		await userUpdateConsumer.connect()
		// Producer
		await createChatProducer.connect()
	}

	await mongoose.connect(`${MONGO_DB_HOST as string}`).then(() => {
		console.log('MongoDB is connected')
	})
})

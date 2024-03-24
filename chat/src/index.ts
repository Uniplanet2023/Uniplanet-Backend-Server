import mongoose from 'mongoose'
import app from './app'
import { secretCheck } from './secret-check'
import { EmailSender, NodemailerEmailApi, kafkaClient, redisClient } from '@uniplanet-lib/common'

import MessageCreatedConsumer from './event/consumer/message_receive'
import MessageReadAllConsumer from './event/consumer/message_read_all'
import MessageReadConsumer from './event/consumer/message_read'
const {
	PORT = 3003,
	NODE_ENV,
	KAFKA_BROKER,
	REDIS_HOST,
	REDIS_PORT,
	MONGO_DB_HOST,
  } = process.env;

if(NODE_ENV === 'production'){
	if(!KAFKA_BROKER){
		throw new Error('KAFKA_BROKER have to be define')
	}	
} 
kafkaClient.create('my-app', [process.env.KAFKA_BROKER! as string])

app.listen(PORT, async () => {
	console.log(`BackEnd Connection : BackEnd Server connected at port ${PORT}`)
	await redisClient.create(process.env.REDIS_HOST!, parseInt(process.env.REDIS_PORT!))
	redisClient.redis.on('error', err => console.log('Redis Client Error', err))
	await redisClient.redis.connect().then(() => {
		console.log('Redis is connected')
	})
	const messageCreatedConsumer = new MessageCreatedConsumer(kafkaClient.kafka, 'messagecreated');
	const messageReadAllConsumer = new MessageReadAllConsumer(kafkaClient.kafka, 'messageread');
	const messageReadConsumer = new MessageReadConsumer(kafkaClient.kafka, 'messagereadall');

	await messageReadConsumer.connect()
	await messageReadAllConsumer.connect()
	await messageCreatedConsumer.connect()
	
	await mongoose.connect(`${process.env.MONGO_DB_HOST as string}`).then(() => {
		console.log('MongoDB is connected')
		
	})
})

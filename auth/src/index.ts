import mongoose from 'mongoose'
import app from './app'
import { UserDeleteScheduler } from './scheduler'
import { secretCheck } from './secret-check'
import { kafkaClient } from './kafka-client'
import { EmailSender, NodemailerEmailApi } from '@uniplanet-lib/common'
// import { redisClient } from './redis-client'
import { UserCreatedProducer } from './events'

const {
	PORT = 3000,
	NODE_ENV,
	KAFKA_BROKER,
	REDIS_HOST,
	REDIS_PORT,
	MONGO_DB_HOST,
  } = process.env;

const emailSender = EmailSender.getInstance()
emailSender.activate()
emailSender.setEmailApi(new NodemailerEmailApi())

// Creating and configuring Kafka client
if(NODE_ENV === 'production'){
	if(!KAFKA_BROKER){
		throw new Error('KAFKA_BROKER have to be define')
	}	
} 
kafkaClient.create('my-app', [process.env.KAFKA_BROKER! as string])
export const userProducer =new UserCreatedProducer(kafkaClient.kafka);

app.listen(PORT, async () => {
	console.log(`BackEnd Connection : BackEnd Server connected at port ${PORT}`)

	secretCheck()
	if (process.env.NODE_ENV == 'production') {	
		await userProducer.connect();
	}
	// await redisClient.create(process.env.REDIS_HOST!, parseInt(process.env.REDIS_PORT!))
	// redisClient.redis.on('error', err => console.log('Redis Client Error', err))
	// await redisClient.redis.connect().then(() => {
	// 	console.log('Redis is connected')
	// })
	await mongoose.connect(`${MONGO_DB_HOST as string}`).then(() => {
		console.log('MongoDB is connected')
		new UserDeleteScheduler().taskInitializer()
	})
})

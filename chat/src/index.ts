import mongoose from 'mongoose'
import app from './app'
import { secretCheck } from './secret-check'
import { kafkaClient } from './kafka-client'
import { EmailSender, NodemailerEmailApi } from '@uniplanet-lib/common'
import { redisClient } from './redis-client'

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
	await mongoose.connect(`${process.env.MONGO_DB_HOST as string}`).then(() => {
		console.log('MongoDB is connected')
		
	})
})

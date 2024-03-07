import mongoose from 'mongoose'
import app from './app'
import { secretCheck } from './secret-check'
import { kafkaClient } from './kafka-client'
import { EmailSender, NodemailerEmailApi } from '@uniplanet-lib/common'

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
	
	await mongoose.connect(`${process.env.MONGO_DB_HOST as string}`).then(() => {
		console.log('MongoDB is connected')
		
	})
})

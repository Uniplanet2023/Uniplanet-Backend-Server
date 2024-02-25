import mongoose from 'mongoose'
import app from './app'
import { UserDeleteScheduler } from './scheduler'
import { secretCheck } from './secret-check'
import { kafkaClient } from './kafka-client'
import { EmailSender, NodemailerEmailApi } from '@uniplanet-lib/common'
import { redisClient } from './redis-client'

const PORT = process.env.PORT || 3000
const emailSender = EmailSender.getInstance()
emailSender.activate()
emailSender.setEmailApi(new NodemailerEmailApi())

app.listen(PORT, async () => {
	console.log(`BackEnd Connection : BackEnd Server connected at port ${PORT}`)

	secretCheck()
	if (process.env.NODE_ENV == 'production') {
		kafkaClient.create('my-app', [process.env.KAFKA_BROKER! as string])
	}
	await redisClient.create(process.env.REDIS_HOST!,parseInt(process.env.REDIS_PORT!));
	redisClient.redis.on('error',(err)=> console.log('Redis Client Error',err));
	await redisClient.redis.connect().then(()=>{
		console.log('Redis is connected')
	});
	await mongoose.connect(`${process.env.MONGO_DB_HOST as string}`).then(() => {
		console.log('MongoDB is connected')
		new UserDeleteScheduler().taskInitializer()
	})
})

import mongoose from 'mongoose'
import app from './app'
import { UserDeleteScheduler } from './scheduler'
import { secretCheck } from './secret-check'
import { kafkaClient } from './kafka-client'

const PORT = process.env.PORT || 3000

app.listen(PORT, async () => {
	console.log(`BackEnd Connection : BackEnd Server connected at port ${PORT}`)

	secretCheck()
	if (process.env.NODE_ENV!) {
		kafkaClient.create('my-app', [process.env.KAFKA_BROKER! as string])
	}

	await mongoose.connect(`${process.env.MONGO_DB_HOST as string}`).then(() => {
		console.log('DB connection!!')
		new UserDeleteScheduler().taskInitializer()
	})
})

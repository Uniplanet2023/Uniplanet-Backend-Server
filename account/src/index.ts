import mongoose from 'mongoose'
import app from './app'

// import { secretCheck } from './secret-check'
import { kafkaClient } from './kafka-client'
import UserCreatedConsumer from './event/consumer/UserCreatedConsumer'


const PORT = process.env.PORT || 3002
// const emailSender = EmailSender.getInstance()
// emailSender.activate()
// emailSender.setEmailApi(new NodemailerEmailApi())

app.listen(PORT, async () => {
	console.log(`BackEnd Connection : BackEnd Server connected at port ${PORT}`)

	// secretCheck()
	if (process.env.NODE_ENV == 'production') {
		kafkaClient.create('my-app', [process.env.KAFKA_BROKER! as string])
        const userCreatedConsumer = new UserCreatedConsumer(kafkaClient.kafka,"usercreated");
        await userCreatedConsumer.connect();
	}
	console.log(process.env.MONGO_DB_HOST);
	await mongoose.connect(`${process.env.MONGO_DB_HOST as string}`).then(() => {
		console.log('MongoDB is connected')
	})
})

import app from './app'
import {
	initializeFirebase,
	initializeKafkaConsumer,
	initializeMongooseWithScheduler,
	initializeProducer,
	initializeRedis,
} from './config'

const { PORT = 3003, NODE_ENV, KAFKA_BROKER } = process.env

export const firebaseAdmin =initializeFirebase();

app.listen(PORT, async () => {
	console.log(`BackEnd Connection : BackEnd Server connected at port ${PORT}`)
	if (NODE_ENV === 'production') {
		if (!KAFKA_BROKER) {
			throw new Error('KAFKA_BROKER have to be define')
		}

		// Kafka Consumer
		await initializeKafkaConsumer()
		// Kafka Producer
		await initializeProducer()
		
		// Redis
		await initializeRedis()
		// Mongoose
		await initializeMongooseWithScheduler()
	}
})

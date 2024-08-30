import { Kafka, EachMessagePayload } from 'kafkajs'
import { Topics } from './topics'

interface Event {
	topic: Topics
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	data: any
}

export abstract class BaseConsumer<T extends Event> {
	abstract topic: T['topic']

	abstract onMessage(data: T['data']): void

	private client: Kafka

	private consumer

	constructor(client: Kafka, groupId: string) {
		this.client = client
		this.consumer = this.client.consumer({ groupId })
	}

	async connect() {
		await this.consumer.connect()
		await this.consumer.subscribe({ topic: this.topic, fromBeginning: true })
		await this.consumer.run({
			eachMessage: async (message: EachMessagePayload) => {
				
				try {
					// Check if the message value is not null and parse it
					if (message.message.value) {
						const parsedData = JSON.parse(message.message.value.toString())
						this.onMessage(parsedData)
					} else {
						console.log('Received null or empty message value, skipping...')
					}
				} catch (error) {
					console.error('Error parsing message', error)
					// Handle parsing error (e.g., log, ignore, or manage the error)
				}
			},
		})
		
	}

	async disconnect() {
		await this.consumer.disconnect()
		
	}
}

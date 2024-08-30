import { Kafka } from 'kafkajs'
import { Topics } from './topics'

interface Event {
	topic: Topics
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	data: any
}

export abstract class BaseProducer<T extends Event> {
	abstract topic: T['topic']

	private client: Kafka

	private producer

	constructor(client: Kafka) {
		this.client = client
		this.producer = this.client.producer()
	}

	async connect() {
		await this.producer.connect()
	}

	async sendMessage(data: T['data']): Promise<void> {
		try {
			const messages = [{ value: JSON.stringify(data) }]
			await this.producer.send({
				topic: this.topic,
				messages,
				// acks: -1,
				// compression: CompressionTypes.GZIP,
			})
			
		} catch (error) {
			console.error('Error in publishing event', error)
			throw error
		}
	}

	async disconnect() {
		await this.producer.disconnect()
		
	}
}

// src/config/kafka.ts
import { kafkaClient } from '@uniplanet-lib/common'

export function initializeKafka(): void {
	const NODE_ENV = process.env.NODE_ENV
	const KAFKA_BROKER = process.env.KAFKA_BROKER
	if (NODE_ENV === 'production' && !KAFKA_BROKER) {
		throw new Error('KAFKA_BROKER must be defined')
	}
	kafkaClient.create('my-app', [KAFKA_BROKER!])
}

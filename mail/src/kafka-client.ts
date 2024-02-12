import { Kafka } from 'kafkajs'

class KafkaClient {
	private _kafka?: Kafka

	create(clientId: string, brokers: string[]) {
		this._kafka = new Kafka({
			clientId: clientId,
			brokers: brokers,
			retry: {
				initialRetryTime: 100,
				retries: 1000,
			},
		})
	}
	get kafka() {
		if (!this._kafka) {
			throw new Error('Cannot access Kafka client before creating it ')
		}
		return this._kafka
	}
}

export const kafkaClient = new KafkaClient()

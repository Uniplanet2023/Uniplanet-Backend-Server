import { Kafka } from 'kafkajs'

class KafkaClient {
	private _kafka?: Kafka

	create(clientId: string, brokers: string[]) {
		// eslint-disable-next-line no-underscore-dangle
		this._kafka = new Kafka({
			clientId: clientId,
			brokers: brokers,
			retry: {
				initialRetryTime: 100,
				retries: 1000,
			},
		});
	}
	
	get kafka() {
		//eslint-disable-next-line no-underscore-dangle
		if (!this._kafka) {
			throw new Error('Cannot access Kafka client before creating it ')
		}
		//eslint-disable-next-line no-underscore-dangle
		return this._kafka
	}
}

export const kafkaClient = new KafkaClient()

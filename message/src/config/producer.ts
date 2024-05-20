import {
	MessageCreatedProducer,
	MessageReadAllProducer,
	MessageReadProducer,
	UserUpdateProducer,
} from '../event/producer'
import { Kafka } from 'kafkajs'

export let messageCreateProvider: MessageCreatedProducer
export let messageReadAllProvider: MessageReadAllProducer
export let messageReadProvider: MessageReadProducer
export let userUpdateProvider: UserUpdateProducer

export async function initializeProducer(kafka: Kafka) {
	messageCreateProvider = new MessageCreatedProducer(kafka)
	messageReadAllProvider = new MessageReadAllProducer(kafka)
	messageReadProvider = new MessageReadProducer(kafka)
	userUpdateProvider = new UserUpdateProducer(kafka)

	await userUpdateProvider.connect()
	await messageCreateProvider.connect()
	await messageReadAllProvider.connect()
	await messageReadProvider.connect()
}

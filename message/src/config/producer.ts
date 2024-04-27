
import { MessageCreatedProducer, MessageReadAllProducer, MessageReadProducer } from '../event/producer';
import { Kafka } from 'kafkajs';

export let messageCreateProvider:MessageCreatedProducer;
export let messageReadAllProvider:MessageReadAllProducer;
export let messageReadProvider:MessageReadProducer;



export async function initializeProducer(kafka:Kafka) {
    messageCreateProvider = new MessageCreatedProducer(kafka)
    messageReadAllProvider = new MessageReadAllProducer(kafka)
    messageReadProvider = new MessageReadProducer(kafka)
    await messageCreateProvider.connect()
	await messageReadAllProvider.connect()
	await messageReadProvider.connect()
}
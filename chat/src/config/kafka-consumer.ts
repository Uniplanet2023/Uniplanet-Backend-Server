import { kafkaClient } from "@uniplanet-lib/common"
import {MessageCreatedConsumer, MessageReadAllConsumer, UserDeletedConsumer, UserUpdateConsumer} from "../event/consumer"

export async function initializeKafkaConsumer(): Promise<void> {
    const messageCreatedConsumer = new MessageCreatedConsumer(kafkaClient.kafka, 'messagecreated')
		const messageReadAllConsumer = new MessageReadAllConsumer(kafkaClient.kafka, 'messageread')
		const userUpdateConsumer = new UserUpdateConsumer(kafkaClient.kafka, 'userupdate')
		const userDeletedConsumer = new UserDeletedConsumer(kafkaClient.kafka, 'userdeleted-chat')

		// Consumer
		await messageReadAllConsumer.connect()
		await messageCreatedConsumer.connect()
		await userUpdateConsumer.connect()
		await userDeletedConsumer.connect()
}

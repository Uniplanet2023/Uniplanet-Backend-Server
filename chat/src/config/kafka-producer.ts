import { kafkaClient } from "@uniplanet-lib/common"
import { CreateChatProducer } from "../event/producer/create_chat"
import { UserUpdateProducer } from "../event/producer/user-update"

export const createChatProducer = new CreateChatProducer(kafkaClient.kafka)
export const userUpdateProvider = new UserUpdateProducer(kafkaClient.kafka)

export async function initializeProducer(): Promise<void> {
    await createChatProducer.connect()
    await userUpdateProvider.connect()
}

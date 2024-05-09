import { createChatProducer, userUpdateProvider } from "../app"


export async function initializeProducer(): Promise<void> {
	await createChatProducer.connect()
	await userUpdateProvider.connect()
}

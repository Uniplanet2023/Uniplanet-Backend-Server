import { createChatProducer, userUpdateProvider } from '..'

export async function initializeProducer(): Promise<void> {
	await createChatProducer.connect()
	await userUpdateProvider.connect()
}

export type GetUserRestPayload = {
	id: string
	name: string
	email: string
	profileImage: string
	school: string
}

export type GetChatRestPayload = {
	id: string
	seller: GetUserRestPayload
	buyer: GetUserRestPayload
	productId: string
	productName: string
	lastMessage?: GetMessageRestPayload
	unseenMessageCount: number
}

export type GetMessageRestPayload = {
	id: string
	sender: string
	receiver: string
	message: string
	messageType: string
	chat: string
	readDate?: Date
	createdAt: Date
}

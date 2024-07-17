export type GetUserRestPayload = {
	id: string
	name: string
	email: string
	profileImage: string
	school: string
	type: string
}

export type GetChatRestPayload = {
	id: string
	seller: string
	buyer: string
	productId: string
	productName: string
	lastMessage?: string
	unseenMessageCount: string
	deletedFrom?: string
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

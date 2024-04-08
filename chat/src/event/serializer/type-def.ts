import { ObjectId } from 'mongoose'

export type GetUserRestPayload = {
	id: String
	name: String
	email: String
	profileImage: String
	school: String
}

export type GetChatRestPayload = {
	id: String
	seller: GetUserRestPayload
	buyer: GetUserRestPayload
	productId: String
	lastMessage?: GetMessageRestPayload
	unseenMessageCount: Number
}

export type GetMessageRestPayload = {
	id: String
	sender: String
	receiver: String
	message: String
	messageType: String
	chat: String
	readDate?: Date
	createdAt: Date
}

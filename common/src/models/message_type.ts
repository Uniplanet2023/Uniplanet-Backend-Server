import { ChatRoomDocument } from './chat_room_type'
import { UserDocument } from './user_type'
import { Document } from 'mongoose'

export type MessageDocument = Document & {
	chatRoomId: ChatRoomDocument
	senderId: UserDocument
	message: string
	type: string
	isSeen: boolean
	seenAt?: Date
}

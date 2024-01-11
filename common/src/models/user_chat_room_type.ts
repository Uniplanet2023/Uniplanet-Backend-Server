import { ChatRoomDocument } from './chat_room_type'
import { MessageDocument } from './message_type'
import { UserDocument } from './user_type'
import { Document } from 'mongoose'

export type UserChatRoomDocument = Document & {
	receiver: UserDocument
	type: string
	chatRoom: ChatRoomDocument
	unseenMessage: MessageDocument[] // Assuming 'Message' schema exists
}

import { MessageDocument } from './message_type'
import { ProductDocument } from './product_type'
import { Document } from 'mongoose'

export type ChatRoomDocument = Document & {
	product: ProductDocument
	chatRoomType: string
	messages: MessageDocument[]
	lastMessage: MessageDocument
}

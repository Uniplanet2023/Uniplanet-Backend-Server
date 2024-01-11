import { EventDocument } from './event_type'
import { ProductDocument } from './product_type'
import { UserChatRoomDocument } from './user_chat_room_type'
import { Document } from 'mongoose'

export type UserDocument = Document & {
	name: string
	email: string
	school: string
	verified: boolean
	password: string
	profileImage: string
	type: string
	recentSearchHistory: string[]
	recentViewHistory: ProductDocument[]
	like: ProductDocument[]
	myEvent: EventDocument[] // Assuming 'Event' schema exists
	selling: ProductDocument[]
	sold: ProductDocument[]
	bought: ProductDocument[]
	myChatRoom: UserChatRoomDocument[]
	version:number
}

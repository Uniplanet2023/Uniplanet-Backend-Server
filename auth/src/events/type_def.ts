import { EventDocument, ProductDocument, UserChatRoomDocument, UserDocument } from '../models'

export type UserSignedUpRestPayload = {
	id: string
	name: string
	email: string
	profileImage: string
	school: string
	verified: boolean
	myEvent: EventDocument[]
	recentSearchHistory: string[]
	recentViewHistory: ProductDocument[]
	like: ProductDocument[]
	selling: ProductDocument[]
	bought: ProductDocument[]
	sold: ProductDocument[]
	myChatRoom: UserChatRoomDocument[]
	type: string
}

export type GetProductRestPayload = {
	id: string
	productName: string
	forSale: boolean
	seller: SellerRestPayload
	description: string
	images: string[]
	likes: UserDocument[]
	price: number
	category: string
}

export type SellerRestPayload = {
	id: string
	name: string
	email: string
	profileImage: string
	school: string
	verified: boolean
	selling: ProductDocument[]
	sold: ProductDocument[]
	type: string
}

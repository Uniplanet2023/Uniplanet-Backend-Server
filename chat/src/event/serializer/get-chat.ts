import { BaseSerializeEvent } from '@uniplanet-lib/common'
import { GetChatRestPayload } from './type-def'
import { ChatDocument } from '../../models/chat'
import GetUserInfo from './get-user'
import GetMessageInfo from './get-message'

export default class GetChatInfo extends BaseSerializeEvent<GetChatRestPayload> {
	private chat: ChatDocument

	private unseenMessageCount: number

	private statusCode = 200

	constructor(chat: ChatDocument, unseenMessageCount: number) {
		super()
		this.chat = chat
		this.unseenMessageCount = unseenMessageCount
	}

	getStatusCode(): number {
		return this.statusCode
	}

	serializeRest(): GetChatRestPayload {
		return {
			id: this.chat._id,
			seller: JSON.stringify(new GetUserInfo(this.chat.seller).serializeRest()),
			buyer: JSON.stringify(new GetUserInfo(this.chat.buyer).serializeRest()),
			productId: this.chat.productId.toString(),
			productName: this.chat.productName,
			lastMessage: this.chat.lastMessage
				? JSON.stringify(new GetMessageInfo(this.chat.lastMessage).serializeRest())
				: undefined,
			unseenMessageCount: JSON.stringify(this.unseenMessageCount ?? 0),
			deletedFrom: this.chat.deletedFrom ?? undefined,
			type: this.chat.type,
		}
	}
}

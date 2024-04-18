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
		unseenMessageCount ? (this.unseenMessageCount = unseenMessageCount) : (this.unseenMessageCount = 0)
	}

	getStatusCode(): number {
		return this.statusCode
	}

	serializeRest(): GetChatRestPayload {
		return {
			id: this.chat._id,
			seller: new GetUserInfo(this.chat.seller).serializeRest(),
			buyer: new GetUserInfo(this.chat.buyer).serializeRest(),
			productId: this.chat.productId.toString(),
			productName: this.chat.productName,
			lastMessage: this.chat.lastMessage ? new GetMessageInfo(this.chat.lastMessage).serializeRest() : undefined,
			unseenMessageCount: this.unseenMessageCount ?? 0,
		}
	}
}

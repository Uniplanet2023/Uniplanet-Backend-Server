import { BaseSerializeEvent } from "@uniplanet-lib/common"
import { GetChatRestPayload } from "./type-def"
import { ChatDocument } from "../../models/chat"
import GetUserInfo from "./get-user"


export default class GetChatInfo extends BaseSerializeEvent<GetChatRestPayload> {
	private chat: ChatDocument

	private statusCode = 201

	constructor(chat: ChatDocument) {
		super()
		this.chat = chat
	}

	getStatusCode(): number {
		return this.statusCode
	}

	serializeRest():GetChatRestPayload {
		return {
			id: this.chat._id,
			seller: new GetUserInfo(this.chat.seller).serializeRest(),
			buyer: new GetUserInfo(this.chat.buyer).serializeRest(),
			productId: this.chat.productId.toString(),
		}
	}
}






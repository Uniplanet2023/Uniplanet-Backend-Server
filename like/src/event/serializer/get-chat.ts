import { BaseSerializeEvent } from "@uniplanet-lib/common"
import { GetChatRestPayload } from "./type-def"
import { ChatDocument } from "../../models/chat"
import GetUserInfo from "./get-user"
import { UserModel } from "../../models/user"
import GetMessageInfo from "./get-message"
import { MessageDocument } from "../../models/message"


export default class GetChatInfo extends BaseSerializeEvent<GetChatRestPayload> {
	private chat: ChatDocument
	private seller: UserModel
	private buyer: UserModel

	private statusCode = 200

	constructor(chat: ChatDocument, seller: UserModel, buyer: UserModel) {
		super()
		this.chat = chat
		this.seller = seller
		this.buyer = buyer
	}

	getStatusCode(): number {
		return this.statusCode
	}

	serializeRest():GetChatRestPayload {
		return {
			id: this.chat._id,
			seller: new GetUserInfo(this.seller).serializeRest(),
			buyer: new GetUserInfo(this.buyer).serializeRest(),
			productId: this.chat.productId.toString(),
			lastMessage: this.chat.lastMessage ? new GetMessageInfo(this.chat.lastMessage).serializeRest(): undefined,
		}
	}
}






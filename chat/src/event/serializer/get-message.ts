import { BaseSerializeEvent } from "@uniplanet-lib/common"
import { GetMessageRestPayload } from "./type-def"
import { MessageDocument } from "../../models/message"
import GetUserInfo from "./get-user"
import { UserModel } from "../../models/user"


export default class GetMessageInfo extends BaseSerializeEvent<GetMessageRestPayload> {
	private message: MessageDocument
	private statusCode = 201

	constructor(message: MessageDocument) {
		super()
		this.message = message
	}

	getStatusCode(): number {
		return this.statusCode
	}

	serializeRest():GetMessageRestPayload {
		return {
			sender: this.message.sender.toString(),
            receiver: this.message.receiver.toString(),
            message: this.message.message,
            messageType: this.message.messageType,
            readBy: this.message.readBy ? this.message.readBy.toString() : undefined,
            createdAt: new Date(this.message.createdAt),
		}
	}
}






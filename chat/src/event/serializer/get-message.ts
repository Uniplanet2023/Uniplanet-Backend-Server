import { BaseSerializeEvent } from '@uniplanet-lib/common'
import { GetMessageRestPayload } from './type-def'
import { MessageDocument } from '../../models/message'

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

	serializeRest(): GetMessageRestPayload {
		return {
			id: this.message ? this.message._id.toString() : '',
			sender: this.message.sender.toString(),
			receiver: this.message.receiver.toString(),
			message: this.message.message,
			messageType: this.message.messageType,
			chat: this.message.chat.toString(),
			readDate: this.message.readDate ? new Date(this.message.readDate) : undefined,
			createdAt: new Date(this.message.createdAt),
		}
	}
}

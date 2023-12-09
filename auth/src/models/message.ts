import { Model, Schema, model, Document } from 'mongoose'
import { ChatRoomDocument, UserDocument } from './index'
export type MessageDocument = Document & {
	chatRoomId: ChatRoomDocument
	senderId: UserDocument
	message: string
	type: string
	isSeen: boolean
	seenAt?: Date
}
export type MessageModel = Model<MessageDocument>

const messageSchema = new Schema(
	{
		chatRoomId: {
			type: Schema.Types.ObjectId,
			ref: 'ChatRoom',
			required: true,
		},
		senderId: {
			type: Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
		message: {
			type: String,
			required: true,
		},
		type: {
			type: String,
			required: true,
		},
		isSeen: {
			type: Boolean,
			default: false,
		},
		seenAt: {
			type: Date,
		},
		deletionDate: { type: Date, default: null },
	},
	{ timestamps: true },
)

const Message = model<MessageDocument, MessageModel>('Message', messageSchema)
export default Message

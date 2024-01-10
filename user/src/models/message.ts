import { MessageDocument } from '@uniplanet-lib/common'
import { Model, Schema, model } from 'mongoose'

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

import mongoose from 'mongoose'

export type MessageDocument = mongoose.Document & {
	id: mongoose.Types.ObjectId
	sender: mongoose.Types.ObjectId
	receiver: mongoose.Types.ObjectId
	message: string
	messageType: string
	readDate: Date
	chat: mongoose.Types.ObjectId
	createdAt: Date
}

type MessageAttrs = {
	sender: string
	message: string
	messageType: string
	receiver: string
	chat: string
	createdAt: Date
}

interface MessageModel extends mongoose.Model<MessageDocument> {
	build(attrs: MessageAttrs): MessageDocument
}

const messageModel = new mongoose.Schema(
	{
		sender: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
		message: { type: String, required: true },
		messageType: { type: String, required: true, default: 'text' },
		receiver: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
		chat: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Chat', index: true },
		readDate: { type: Date, index: true },
	},
	{ timestamps: true },
)

messageModel.statics.build = (attrs: MessageAttrs) => {
	//eslint-disable-next-line @typescript-eslint/no-use-before-define
	return new Message(attrs)
}

const Message = mongoose.model<MessageDocument, MessageModel>('Message', messageModel)

export default Message

import mongoose from 'mongoose'
import { MessageDocument } from './message'
import { UserDocument } from './user'

export type ChatDocument = mongoose.Document & {
	productId: mongoose.Types.ObjectId
	buyer: UserDocument
	seller: UserDocument
	lastMessage: MessageDocument
}

type ChatAttrs = {
	productId: String
	buyer: String
	seller: String
	lastMessage?: String
}

interface ChatModel extends mongoose.Model<ChatDocument> {
	build(attrs: ChatAttrs): ChatDocument
}

const chatModel = new mongoose.Schema(
	{
		productId: { type: mongoose.Schema.Types.ObjectId, required: true },
		seller: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
		buyer: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
		lastMessage: { type: mongoose.Schema.Types.ObjectId, ref: 'Message', default: null },
		deletionDate: { type: Date, default: null },
	},
	{ timestamps: true },
)

chatModel.statics.build = (attrs: ChatAttrs) => {
	return new Chat(attrs)
}

const Chat = mongoose.model<ChatDocument, ChatModel>('Chat', chatModel)

export default Chat

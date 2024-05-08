import mongoose from 'mongoose'
import { MessageDocument } from './message'
import { UserDocument } from './user'

export type UnseenMessageDocument = mongoose.Document & {
	user: string
    chat: string
    unseenMessages: number
    deletionDate: Date
}

type UnseenMessageAttrs = {
	user: string
    chat: string
    unseenMessages: number
}

interface UnseenMessageModel extends mongoose.Model<UnseenMessageDocument> {
	build(attrs: UnseenMessageAttrs): UnseenMessageDocument
}

const unSeenMessagetModel = new mongoose.Schema(
	{
		user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
        chat: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Chat'},
		unseenMessages: { type: Number, required: true, default: 0 },
		deletionDate: { type: Date, default: null },
	},
	{ timestamps: true },
)

unSeenMessagetModel.statics.build = (attrs: UnseenMessageAttrs) => {
	return new UnseenMessage(attrs)
}

const UnseenMessage = mongoose.model<UnseenMessageDocument, UnseenMessageModel>('UnseenMessage', unSeenMessagetModel)

export default UnseenMessage

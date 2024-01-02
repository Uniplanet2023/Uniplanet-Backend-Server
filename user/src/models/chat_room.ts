import { ChatRoomDocument } from '@uniplanet-lib/common'
import { Model, Schema, model } from 'mongoose'


export type ChatRoomModel = Model<ChatRoomDocument>

// Define the schema
const chatRoomSchema: Schema = new Schema(
	{
		product: { type: Schema.Types.ObjectId, ref: 'Product' },
		chatRoomType: { type: String },
		messages: [{ type: Schema.Types.ObjectId, ref: 'Message' }],
		lastMessage: { type: Schema.Types.ObjectId, ref: 'Message' },
		deletionDate: { type: Date, default: null },
	},
	{ timestamps: true },
)
// Create the model
const ChatRoom = model<ChatRoomDocument, ChatRoomModel>('ChatRoom', chatRoomSchema)
export default ChatRoom

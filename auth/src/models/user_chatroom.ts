import { Model, Schema, model, Document } from 'mongoose'
import { ChatRoomDocument, UserDocument, MessageDocument } from './index'
export type UserChatRoomDocument = Document & {
	receiver: UserDocument
	type: string
	chatRoom: ChatRoomDocument
	unseenMessage: MessageDocument[] // Assuming 'Message' schema exists
}
export type UserChatRoomModel = Model<UserChatRoomDocument>

const userChatRoomSchema: Schema = new Schema(
	{
		receiver: {
			type: Schema.Types.ObjectId,
			ref: 'User',
		},
		type: {
			type: String,
		},
		chatRoom: {
			type: Schema.Types.ObjectId,
			ref: 'ChatRoom',
		},
		unseenMessage: [
			{
				type: Schema.Types.ObjectId,
				ref: 'Message',
			},
		],
	},
	{ timestamps: true },
)

const UserChatRoom = model<UserChatRoomDocument, UserChatRoomModel>('UserChatRoom', userChatRoomSchema)
export default UserChatRoom

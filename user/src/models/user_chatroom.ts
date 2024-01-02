import { UserChatRoomDocument } from '@uniplanet-lib/common'
import { Model, Schema, model } from 'mongoose'

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

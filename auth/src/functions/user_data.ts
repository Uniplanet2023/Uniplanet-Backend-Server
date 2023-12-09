import User from '../models/user' // Adjust the path according to your project structure
import UserChatRoom from '../models/user_chatroom'

async function signInFunction(email: string) {
	const user = await User.findOne({ email }).populate({
		path: 'myChatRoom',
		populate: [
			{
				path: 'chatRoom',
				populate: [
					{ path: 'lastMessage' },
					{
						path: 'product',
						populate: {
							path: 'seller',
							select: 'name email _id school verified profileImage like selling sold bought type',
						},
					},
				],
			},
			{
				path: 'receiver',
				select: 'name email _id school verified profileImage like selling sold bought type',
			},
		],
	})
	return user
}
async function getUserDataFunction(userId: string) {
	const user = await User.findById(userId).populate({
		path: 'myChatRoom',
		populate: [
			{
				path: 'chatRoom',
				populate: [
					{ path: 'lastMessage' },
					{
						path: 'product',
						populate: {
							path: 'seller',
							select: 'name email _id school verified profileImage like selling sold bought type',
						},
					},
				],
			},
			{
				path: 'receiver',
				select: 'name email _id school verified profileImage like selling sold bought type',
			},
		],
	})
	return user
}

async function getMyChatRoomDataFunction(myChatRoomId: string) {
	const user = await UserChatRoom.findById(myChatRoomId).populate([
		{
			path: 'chatRoom',
			populate: [
				{ path: 'lastMessage' },
				{
					path: 'product',
					populate: {
						path: 'seller',
						select: 'name email _id school verified profileImage like selling sold bought type',
					},
				},
			],
		},
		{
			path: 'receiver',
			select: 'name email _id school verified profileImage like selling sold bought type',
		},
	])
	return user
}

export { signInFunction, getUserDataFunction, getMyChatRoomDataFunction }

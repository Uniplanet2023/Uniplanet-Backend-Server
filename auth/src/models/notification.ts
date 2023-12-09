import { Model, Schema, model, Document } from 'mongoose'
import { User, MessageDocument } from './index'

export type NotificationDocument = Document & {
	noticeMessages: MessageDocument
}

export type NotificationModel = Model<NotificationDocument>
const notificationSchema = new Schema(
	{
		noticeMessages: {
			senderId: {
				type: Schema.Types.ObjectId,
				ref: 'User',
				required: true,
			},
			message: {
				type: String,
				required: true,
			},
			deletionDate: { type: Date, default: null },
		},
	},
	{ timestamps: true },
)

const Notification = model<NotificationDocument, NotificationModel>('Notification', notificationSchema)

// Watch the Notification collection
Notification.watch().on('change', async change => {
	if (change.operationType === 'insert' && change.fullDocument && change.fullDocument._id) {
		const notificationId = change.fullDocument._id

		try {
			await User.updateMany(
				{},
				{
					$push: {
						unseenNotifications: notificationId,
					},
				},
			)
		} catch (err) {
			console.error("Error updating all users' unseenNotifications:", err)
		}
	}
})

export default Notification

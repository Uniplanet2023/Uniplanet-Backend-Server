import { EventDocument } from '@uniplanet-lib/common'
import { Model, Schema, model } from 'mongoose'

export type EventModel = Model<EventDocument>

const eventSchema = new Schema(
	{
		title: { type: String, required: true },
		description: { type: String, required: true },
		startDate: { type: Date, required: true },
		endDate: { type: Date, required: true },
		location: { type: String, required: true },
		images: [String],
		organizer: {
			type: Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
		likes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
		deletionDate: { type: Date, default: null },
	},
	{ timestamps: true },
)

const Event = model<EventDocument, EventModel>('Event', eventSchema)
export default Event

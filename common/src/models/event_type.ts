import { UserDocument } from './user_type'
import { Document } from 'mongoose'

export type EventDocument = Document & {
	title: string
	description: string
	startDate: Date
	endDate: Date
	location: string
	images: string[]
	organizer: UserDocument
	likes: UserDocument[]
	createdAt: Date
}

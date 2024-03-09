import { Document } from 'mongoose'

export type UserModel = Document & {
	id: string
	name: string
	email: string
	school: string
	profileImage: string
}

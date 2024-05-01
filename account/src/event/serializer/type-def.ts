export type GetAccountRestPayload = {
	id: string
	name: string
	email: string
	profileImage: string
	school: string
	type: string
	maximumPost?: number
	numberOfPost?: number
	maximumClick?: number
	numberOfClick?: number
}
export type UserRestPayload = {
	id: string
	name: string
	email: string
	school: string
	profileImage: string
}

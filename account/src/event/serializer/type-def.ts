export type GetAccountRestPayload = {
	id: string
	name: string
	email: string
	profileImage: string
	school: string
	unreadNotification: number
	unreadMessage: number
	searchHistory: string[]
	recentViewHistory: string[]
}
export type UserRestPayload = {
	id: string
	name: string
	email: string
	school: string
	profileImage: string
}

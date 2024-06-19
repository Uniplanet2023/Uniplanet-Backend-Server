export type GetAccountRestPayload = {
	id: string
	name: string
	email: string
	profileImage: string
	school: string
	type: string
	isBlocked: boolean
	isBlockedPost: boolean
	isBlockedChat: boolean
}
export type GetAdvertiserRestPayload = {
	id: string
	name: string
	email: string
	profileImage: string
	school: string
	type: string
	isBlocked: boolean
	isBlockedPost: boolean
	isBlockedChat: boolean
	maximumPost: number
	numberOfPost: number
	costPerClick: number
	usedCredit: number
	givenCredit: number
	budget: number
	spent: number
}

export type UserRestPayload = {
	id: string
	name: string
	email: string
	school: string
	profileImage: string
}

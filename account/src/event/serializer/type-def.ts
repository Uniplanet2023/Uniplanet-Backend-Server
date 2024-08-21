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
	subscription: string
	numberOfFreeItemClick: number
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
	freeCreditUsed: number
	freeCredit: number
	credit: number
	creditUsed: number
	subscription: string
	numberOfFreeItemClick: number
}

export type UserRestPayload = {
	id: string
	name: string
	email: string
	school: string
	profileImage: string
}

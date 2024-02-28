export type SellerRestPayload = {
	id: string
	name: string
	email: string
	profileImage: string
	school: string
}

export type GetProductRestPayload = {
	id: string
	productName: string
	status: string
	seller: SellerRestPayload
	description: string
	images: string[]
	likes: number
	price: number
	category: string
	createdAt: Date
}
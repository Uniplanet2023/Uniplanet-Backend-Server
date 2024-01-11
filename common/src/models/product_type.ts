import { UserDocument } from './user_type'
import { Document } from 'mongoose'

export type ProductDocument = Document & {
	productName: string
	forSale: boolean
	seller: UserDocument
	description: string
	images: string[]
	likes: UserDocument[]
	price: number
	category: string
}

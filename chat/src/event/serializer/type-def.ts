import { ObjectId } from "mongoose"

export type GetUserRestPayload = {
    id: string
    name: string
    email: string
    profileImage: string
    school: string
}


export type GetChatRestPayload = {
    id: ObjectId
    seller: GetUserRestPayload
    buyer: GetUserRestPayload
    productId: string
    latestMessage?: string
}
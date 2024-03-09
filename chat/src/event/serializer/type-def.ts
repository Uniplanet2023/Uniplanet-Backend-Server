import { ObjectId } from "mongoose"

export type GetUserRestPayload = {
    id: String
    name: String
    email: String
    profileImage: String
    school: String
}


export type GetChatRestPayload = {
    id: ObjectId
    seller: GetUserRestPayload
    buyer: GetUserRestPayload
    productId: String
    latestMessage?: GetMessageRestPayload
}

export type GetMessageRestPayload = {
    sender: String
    receiver: String
    message: String
    messageType: String
    readBy?: String
    createdAt: Date
}

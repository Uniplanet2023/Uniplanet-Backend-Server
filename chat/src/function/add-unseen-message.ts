import { redisClient } from "@uniplanet-lib/common";
import { MessageDocument } from "../models/message";

export async function addUnSeenMessage({userId, message}: {userId: string, message: MessageDocument}) {
    await redisClient.redis.zAdd(`user:${userId}:unseen`, {
        score: new Date(message.createdAt).getTime(),
        value: JSON.stringify(message),
    })
}
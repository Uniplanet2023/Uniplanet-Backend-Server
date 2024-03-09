
import express from 'express'
import Chat from '../models/chat'
import { redisClient, tokenValidation } from '@uniplanet-lib/common'
import { GET_CHAT_LIST} from './routes-def';
import GetChatInfo from '../event/serializer/get-chat';
import { GetChatRestPayload } from '../event/serializer/type-def';

const getChatRouter = express.Router()
getChatRouter.get(GET_CHAT_LIST, tokenValidation, async (req, res) => {
    const chatList:GetChatRestPayload[] = [];
    const chats = await Chat.find({
        $or: [{ seller: req.user!.id }, { buyer: req.user!.id }]
    });
    if (!chats) {
        return res.status(404).send('No chats found');
    }
    
    chats.forEach(async (chat) => {
        const sellerData = await redisClient.redis.get(chat.seller.toString());
        const buyerData = await redisClient.redis.get(chat.buyer.toString());
        if(!sellerData || !buyerData){
            return res.status(404).send('User not found');
        }
        const seller = JSON.parse(sellerData!);
        const buyer = JSON.parse(buyerData!);
        chatList.push(new GetChatInfo(chat,seller,buyer).serializeRest());;
    });
    
    console.log(chatList);

    return res.status(201).send(chatList);
})
export default getChatRouter

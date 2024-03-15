
import express from 'express'
import Chat from '../models/chat'
import { redisClient, tokenValidation } from '@uniplanet-lib/common'
import { GET_CHAT_LIST} from './routes-def';
import GetChatInfo from '../event/serializer/get-chat';
import { GetChatRestPayload } from '../event/serializer/type-def';

const getChatRouter = express.Router()
getChatRouter.get(GET_CHAT_LIST, tokenValidation, async (req, res) => {
    const chatList = [];
    const chats = await Chat.find({
        $or: [{ seller: req.user!.id }, { buyer: req.user!.id }]
    }).populate('lastMessage')
    .sort({ updatedAt: -1 });

    if (!chats || chats.length === 0) {
        return res.status(404).send('No chats found');
    }

    for (const chat of chats) {
        const sellerData = await redisClient.redis.get(chat.seller.toString());
        const buyerData = await redisClient.redis.get(chat.buyer.toString());

        if (!sellerData || !buyerData) {
            throw new Error('User not found'); // Consider handling this scenario differently, as this will exit the function
            // Consider handling this scenario differently, as this will exit the function 
            // on the first occurrence of missing data, potentially leaving valid chats unprocessed.
            // You might want to just skip this iteration and continue with the next one.
            // or use some form of error handling/logic that fits your needs.
        }
        console.log('trigger');
        const seller = JSON.parse(sellerData);
        const buyer = JSON.parse(buyerData);

        chatList.push(new GetChatInfo(chat, seller, buyer).serializeRest());
    }

    return res.status(200).json(chatList); // Changed status code to 200 for successful response
});
export default getChatRouter
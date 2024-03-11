import express from 'express';
import Chat from '../models/chat';
import { tokenValidation } from '@uniplanet-lib/common';
import { CREATE_CHAT } from './routes-def';
import GetChatInfo from '../event/serializer/get-chat';
import { redisClient } from '../redis-client';

const createChatRouter = express.Router();

createChatRouter.post(CREATE_CHAT, tokenValidation, async (req, res) => {
    const { productId, sellerId} = req.body;

    // Check if a chat already exists between these two users for this product
    const existingChat = await Chat.findOne({
        productId: productId,
        buyer: req.user!.id,
        seller: sellerId,
    });
    console.log('existing chat:', existingChat);

    const sellerData = await redisClient.redis.get(sellerId);
    const buyerData = await redisClient.redis.get(req.user!.id);
    if (!sellerData || !buyerData) {
        return res.status(404).send('User not found');
    }
    const seller = JSON.parse(sellerData);
    const buyer = JSON.parse(buyerData);

    if (existingChat) {
        const chatInfo = new GetChatInfo(existingChat, seller, buyer);
        return res.status(chatInfo.getStatusCode()).json(chatInfo.serializeRest());
    }
    
    // Create and save the chat
    const chat = Chat.build({
        productId: productId,
        buyer: req.user!.id,
        seller: sellerId,
    });
    await chat.save();
    const chatInfo = new GetChatInfo(chat,seller,buyer);
    // Include serialized buyer and seller data in the response
    return res.status(chatInfo.getStatusCode()).json(chatInfo.serializeRest());
});

export default createChatRouter;

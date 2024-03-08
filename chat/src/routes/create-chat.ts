import express from 'express';
import Chat from '../models/chat';
import { tokenValidation } from '@uniplanet-lib/common';
import { CREATE_CHAT } from './routes-def';
import User from '../models/user';
import GetChatInfo from '../event/serializer/get-chat';
import { redisClient } from '../redis-client';

const createChatRouter = express.Router();

createChatRouter.post(CREATE_CHAT, tokenValidation, async (req, res) => {
    const { productId, sellerId, sellerName, sellerEmail,sellerProfile, sellerSchool } = req.body;

    // Check if a chat already exists between these two users for this product
    const existingChat = await Chat.findOne({
        product: productId,
        $and: [
            { buyer: req.user!.id, seller: sellerId }
        ],
    });

    if (existingChat) {
        redisClient.redis.get(existingChat.seller, (err, reply) => {
            if (err) {
                console.log('Redis Error', err);
            } else {
                console.log('Redis Reply', reply);
            }
        });
        existingChat.seller
        const chatInfo = new GetChatInfo(existingChat);
        return res.status(chatInfo.getStatusCode()).json(chatInfo.serializeRest());
    }
    let seller = await User.findById(sellerId);
    if (!seller) {
        seller = User.build({
            _id: sellerId,
            email: sellerEmail,
            name: sellerName,
            school: sellerSchool,
            profileImage: sellerProfile,
        });
        await seller.save();
    }
    let buyer = await User.findById(req.user!.id);
    if (!buyer) {
        buyer = User.build({
            _id: req.user!.id,
            email: req.user!.email,
            name: req.user!.name,
            school: req.user!.school,
            profileImage: req.user!.profileImage,
        });
        await buyer.save();
    }
    // Create and save the chat
    const chat = Chat.build({
        productId: productId,
        buyer: req.user!.id,
        seller: sellerId,
    });
    await chat.save();
    const chatInfo = new GetChatInfo(chat);
    // Include serialized buyer and seller data in the response
    return res.status(chatInfo.getStatusCode()).json(chatInfo.serializeRest());
});

export default createChatRouter;

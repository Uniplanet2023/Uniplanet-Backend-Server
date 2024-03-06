import express from 'express';
import Chat from '../models/chat';
import { tokenValidation } from '@uniplanet-lib/common';
import { CREATE_CHAT } from './routes-def';
import User from '../models/user';
import GetChatInfo from '../event/serializer/get-chat';

const createChatRouter = express.Router();

createChatRouter.post(CREATE_CHAT, tokenValidation, async (req, res) => {
    const { productId, sellerId } = req.body;

    // Check if a chat already exists between these two users for this product
    const existingChat = await Chat.findOne({
        product: productId,
        $or: [
            { buyer: req.user!.id, seller: sellerId },
            { seller: req.user!.id, buyer: sellerId }
        ],
    });

    if (existingChat) {
        return res.status(400).send({ error: 'Chat already exists' });
    }

    // Ensure both the seller and the buyer exist in the database
    const seller = await User.findById(sellerId);
    const buyer = await User.findById(req.user!.id); // Assuming req.user.id is populated with the authenticated user's ID

    if (!seller || !buyer) {
        return res.status(404).send({ error: 'User not found' });
    }

    // Create and save the chat
    const chat = Chat.build({
        productId: productId,
        buyer: buyer._id,
        seller: seller._id
    });
    await chat.save();
    await chat.populate( 'buyer seller');
    const chatInfo = new GetChatInfo(chat);
    // Include serialized buyer and seller data in the response
    return res.status(chatInfo.getStatusCode()).json(chatInfo.serializeRest());
});

export default createChatRouter;

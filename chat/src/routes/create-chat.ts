import express, { Request, Response } from 'express';
import Chat from '../models/chat';
import { tokenValidation } from '@uniplanet-lib/common';
import { CREATE_CHAT } from './routes-def';
import GetChatInfo from '../event/serializer/get-chat';
import User from '../models/user';
import Message from '../models/message';
import { createChatProducer } from '../app';

const createChatRouter = express.Router();

createChatRouter.post(CREATE_CHAT, tokenValidation, async (req: Request, res: Response) => {
    const { productId, productName, productType, seller, buyer, type } = req.body;
	if(!productId || !productName || !productType || !seller || !buyer || !type){
		return res.status(400).json({ msg: 'Missing required fields' });
	}
    let sellerParsed, buyerParsed;
    try {
        sellerParsed = JSON.parse(seller);
        buyerParsed = JSON.parse(buyer);
    } catch (error) {
        return res.status(400).json({ msg: 'Invalid seller or buyer data' });
    }

    let sellerObj = await User.findById(sellerParsed.id);
    let buyerObj = await User.findById(buyerParsed.id);

    if (!sellerObj) {
        sellerObj = User.build(sellerParsed);
        await sellerObj.save();
    }

    if (!buyerObj) {
        buyerObj = User.build(buyerParsed);
        await buyerObj.save();
    }else if( buyerObj.isBlocked){
        return res.status(400).json({ msg: 'You are blocked from sending messages' });
    }

    // Validate free item conditions
    if (productType === "Free Item" && req.user!.id === buyerObj.id) {
        if (buyerObj.numberOfFreeItemClick <= 0) {
            return res.status(400).json({ msg: 'You can only receive 2 free items per day. Please try again tomorrow!' });
        } else {
            buyerObj.numberOfFreeItemClick -= 1;
            await buyerObj.save();
        }
    }

    // Check if a chat already exists between these two users for this product
    const existingChat = await Chat.findOne({ productId, buyer: buyerObj, seller: sellerObj })
        .populate('buyer')
        .populate('seller')
        .populate('lastMessage');

    if (existingChat) {
        let msg = 'existing chat';
		existingChat.deletionDate = undefined;
		existingChat.deletedFrom = undefined;
		existingChat.perminentDelete = false;
        if (existingChat.deletionDate) {
            msg = 'chat restored';
            await existingChat.updateOne({ deletionDate: null, deletedFrom: null, perminentDelete: false });
            await Message.updateMany({ chat: existingChat.id }, { deletionDate: null });
        }

        const unseenMessage = await Message.find({ chat: existingChat._id, receiver: req.user!.id, readDate: null });
        const chatInfo = new GetChatInfo(existingChat, unseenMessage.length);
        return res.status(chatInfo.getStatusCode()).json({ chat: chatInfo.serializeRest(), msg });
    }

    // Create and save the new chat
    const chat = Chat.build({
        productName,
        productId,
        buyer: buyerObj.id,
        seller: sellerObj.id,
        type,
    });

    const chatObj = await (await chat.save()).populate('seller buyer');

    try {
        await createChatProducer.sendMessage({
            userId: req.user!.id,
            productId,
            type });
    } catch (error) {
        return res.status(500).json({ msg: 'Error sending message to producer' });
    }

    const chatInfo = new GetChatInfo(chatObj, 0);
    return res.status(chatInfo.getStatusCode()).json({ chat: chatInfo.serializeRest(), msg: 'new chat' });
});

export default createChatRouter;
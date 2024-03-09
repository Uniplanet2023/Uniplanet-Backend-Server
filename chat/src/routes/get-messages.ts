
import express from 'express'
import Chat from '../models/chat'
import { redisClient, tokenValidation } from '@uniplanet-lib/common'
import { GET_MESSAGES} from './routes-def';
import { GetMessageRestPayload } from '../event/serializer/type-def';
import Message from '../models/message';
import GetMessageInfo from '../event/serializer/get-message';

const getMessagesRouter = express.Router()
getMessagesRouter.get(GET_MESSAGES, tokenValidation, async (req, res) => {
    console.log('here');
    const {chatId, page} = req.query;
    const chat = await Chat.findById(chatId);
    if (!chat) {
        return res.status(404).send('Chat not found');
    }
    if(!chat.buyer.equals(req.user!.id) && !chat.seller.equals(req.user!.id)){
        return res.status(401).send('Unauthorized');
    }
    
    console.log('received chatId:', chatId, 'page:', page)
    const pageNumber = parseInt(page as string) || 1;
    const limit = 20;
    const skip = (pageNumber - 1) * limit;
    
    const messages = await Message.find({ chat: chatId }).skip(skip).limit(limit);
    if (!messages) {
        return res.status(404).send('No messages found');
    }

    const messageList:GetMessageRestPayload[] = [];
    messages.forEach(async (message) => {
        const messageInfo: GetMessageRestPayload = new GetMessageInfo(message).serializeRest()
        messageList.push(messageInfo);
    });

    return res.status(201).send(messageList);
})
export default getMessagesRouter

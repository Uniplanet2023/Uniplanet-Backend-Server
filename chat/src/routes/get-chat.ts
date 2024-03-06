
import express from 'express'
import Chat from '../models/chat'
import { tokenValidation } from '@uniplanet-lib/common'
import { GET_CHAT_LIST} from './routes-def';
import GetChatInfo from '../event/serializer/get-chat';
import { GetChatRestPayload } from '../event/serializer/type-def';

const getChatRouter = express.Router()
getChatRouter.get(GET_CHAT_LIST, tokenValidation, async (req, res) => {
    const chatList:GetChatRestPayload[] =  [];
    const chats = await Chat.find({
        $or: [{ seller: req.user!.id }, { buyer: req.user!.id }]
    }).populate('buyer seller').exec(); // Corrected 'product' and combined populate calls
    chats.forEach(chat => {
        chatList.push(new GetChatInfo(chat).serializeRest());;
    }
    );
    return res.status(201).send(chatList);
})
export default getChatRouter

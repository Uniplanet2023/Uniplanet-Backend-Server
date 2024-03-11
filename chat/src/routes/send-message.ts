
import express from 'express'
import Chat from '../models/chat'
import { tokenValidation } from '@uniplanet-lib/common'
import { GET_MESSAGES, SEND_MESSAGE} from './routes-def';
import { GetMessageRestPayload } from '../event/serializer/type-def';
import Message from '../models/message';
import GetMessageInfo from '../event/serializer/get-message';

const sendMessagesRouter = express.Router()
sendMessagesRouter.post(SEND_MESSAGE, tokenValidation, async (req, res) => {
    const {message, messageType, receiver, chat} = req.body;
    console.log('received chatId:', chat);
    const msg = await Message.build({
        sender: req.user!.id,
        chat,
        message,
        messageType,
        receiver
    }).save();

    return res.status(201).send(msg);
})
export default sendMessagesRouter

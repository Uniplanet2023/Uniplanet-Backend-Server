import express from 'express'
import Chat from '../models/chat'
import { redisClient, tokenValidation } from '@uniplanet-lib/common'
import { CREATE_CHAT, DELETE_CHAT_ROUTE } from './routes-def'
import GetChatInfo from '../event/serializer/get-chat'
import User from '../models/user'
import { createChatProducer } from '..'
import Message from '../models/message'

const deleteChatRouter = express.Router()

deleteChatRouter.post(DELETE_CHAT_ROUTE, tokenValidation, async (req, res) => {
	const { chatId } = req.params

	const chatRoom = await Chat.findById(chatId);
    if(chatRoom === null){
        return res.status(404).send({message: 'Chat not found'});
    }
    chatRoom.deletionDate = new Date();
    await Message.updateMany({chat: chatId}, {deletionDate: new Date()});
    await chatRoom.save();
    

    return res.status(200).send({message: 'Chat deleted successfully'});
})

export default deleteChatRouter

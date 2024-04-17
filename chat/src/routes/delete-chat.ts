import express from 'express'
import Chat from '../models/chat'
import { redisClient, tokenValidation } from '@uniplanet-lib/common'
import { CREATE_CHAT, DELETE_CHAT_ROUTE } from './routes-def'
import GetChatInfo from '../event/serializer/get-chat'
import User from '../models/user'
import { clouninaryAPI, createChatProducer } from '..'
import Message from '../models/message'

const deleteChatRouter = express.Router()

deleteChatRouter.delete(DELETE_CHAT_ROUTE, tokenValidation, async (req, res) => {
	const { chatId } = req.params
    
        if (!chatId) {
            return res.status(400).json({ error: 'Missing required fields' });
        }
        console.log(' start deleting chat: '+ chatId);
        // Delete all the images from cloudinary
        let types = ["image", "raw"]

        for (const type of types) {
            let resp = await clouninaryAPI.api.resources({
                resource_type: "image",
                max_results: 500,
                prefix: chatId,
                type: "upload"
            })
            let public_ids = resp.resources.map((resource: any) => resource.public_id)
            clouninaryAPI.api.delete_resources(public_ids, { resource_type: type })
        }
        
        

        console.log('start deleting folder')
    await clouninaryAPI.api.delete_folder(chatId);
    console.log('successfully deleted');
        
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

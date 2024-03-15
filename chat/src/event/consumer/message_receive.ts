import { Kafka, EachMessagePayload } from 'kafkajs';
import { Topics, BaseConsumer, MessageCreatedEvent } from '@uniplanet-lib/common';
import { profile } from 'console';
import Message from '../../models/message';
import Chat from '../../models/chat';



// Extend the BaseConsumer for the user:created event
export default class MessageCreatedConsumer extends BaseConsumer<MessageCreatedEvent> {
    topic:Topics.MessageCreated = Topics.MessageCreated;

    constructor(kafka:Kafka, groupId:string){
        super(kafka,groupId);
    }
    // Implement the onMessage method
    async onMessage(data: MessageCreatedEvent['data']): Promise<void> {
        console.log('Message Received');
        console.log(data);
        const msgModel = Message.build({
            sender: data.sender,
            receiver: data.receiver,
            message: data.message,
            messageType: data.messageType,
            chat: data.chat,
            createdAt: data.createdAt
        })
        const msg = await msgModel.save();
        await Chat.findByIdAndUpdate(data.chat, { lastMessage: msg._id});
    }

}

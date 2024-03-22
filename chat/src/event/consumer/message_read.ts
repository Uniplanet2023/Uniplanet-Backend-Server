import { Kafka, EachMessagePayload } from 'kafkajs';
import { Topics, BaseConsumer, MessageCreatedEvent, MessageReadEvent } from '@uniplanet-lib/common';
import { profile } from 'console';
import Message from '../../models/message';
import Chat from '../../models/chat';



// Extend the BaseConsumer for the user:created event
export default class MessageReadConsumer extends BaseConsumer<MessageReadEvent> {
    topic:Topics.MessageRead = Topics.MessageRead;

    constructor(kafka:Kafka, groupId:string){
        super(kafka,groupId);
    }
    // Implement the onMessage method
    async onMessage(data: MessageReadEvent['data']): Promise<void> {
        try{
            console.log('Message Read Kafka');
            console.log(data);
            await Message.find({chat: data.chat, receiver: data.sender}).updateMany({readDate: data.readDate});
        }catch(err){
            console.log(err);
        }
        
    }

}

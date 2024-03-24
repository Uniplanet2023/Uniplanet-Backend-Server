import { Kafka, EachMessagePayload } from 'kafkajs';
import { Topics, BaseConsumer, MessageCreatedEvent, MessageReadEvent, MessageReadAllEvent } from '@uniplanet-lib/common';
import { profile } from 'console';
import Message from '../../models/message';
import Chat from '../../models/chat';



// Extend the BaseConsumer for the user:created event
export default class MessageReadAllConsumer extends BaseConsumer<MessageReadAllEvent> {
    topic:Topics.MessageReadAll = Topics.MessageReadAll;

    constructor(kafka:Kafka, groupId:string){
        super(kafka,groupId);
    }
    // Implement the onMessage method
    async onMessage(data: MessageReadAllEvent['data']): Promise<void> {
        try{
            console.log('Message Read All Kafka');
            console.log(data);
            await Message.find({chat: data.chat, receiver: data.sender, readDate:null}).updateMany({readDate: data.readDate});
        }catch(err){
            console.log(err);
        }
        
    }

}

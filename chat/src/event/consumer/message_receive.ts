import { Kafka, EachMessagePayload } from 'kafkajs';
import { Topics, BaseConsumer, UserCreatedEvent, MessageReceiveEvent } from '@uniplanet-lib/common';
import { profile } from 'console';
import Message from '../../models/message';
import Chat from '../../models/chat';



// Extend the BaseConsumer for the user:created event
export default class MessageReceiveConsumer extends BaseConsumer<MessageReceiveEvent> {
    topic:Topics.MessageReceive = Topics.MessageReceive;

    constructor(kafka:Kafka, groupId:string){
        super(kafka,groupId);
    }
    // Implement the onMessage method
    async onMessage(data: MessageReceiveEvent['data']): Promise<void> {

        const msgModel = Message.build({
            sender: data.sender,
            receiver: data.receiver,
            message: data.message,
            messageType: data.messageType,
            chat: data.chat,
        })
        const msg = await msgModel.save();
        await Chat.findByIdAndUpdate(data.chat, { lastMessage: msg._id});
    }

}

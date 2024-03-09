import { Topics } from "./topics";

export interface MessageReceiveEvent{
    topic: Topics.MessageReceive;
    data: {
        sender: string;
        receiver: string;
        message: string;
        messageType: string;
        readBy: string;
        chat: string;
        readDate?: Date;
    };
  }
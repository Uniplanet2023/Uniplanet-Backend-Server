import { Topics } from "./topics";

export interface MessageReadEvent{
    topic: Topics.MessageRead;
    data: {
        sender: string;
        chat: string;
        readDate: Date;
    };
  }
import { Topics } from "./topics";

export interface MessageReadAllEvent{
    topic: Topics.MessageReadAll;
    data: {
        sender: string;
        chat: string;
        readDate: Date;
    };
  }
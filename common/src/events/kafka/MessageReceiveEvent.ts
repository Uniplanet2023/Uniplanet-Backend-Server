import { Topics } from "./topics";

export interface MessageReceiveEvent{
    topic: Topics.MessageReceive;
    data: {
      id: string;
      message: string;
      sender: string;
      receiver: string;
    };
  }
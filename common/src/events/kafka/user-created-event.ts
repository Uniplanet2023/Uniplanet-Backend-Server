import { Topics } from "./topics";


export interface UserCreatedEvent {
  topic: Topics.UserCreated;
  data: {
    email: string;
  };
}

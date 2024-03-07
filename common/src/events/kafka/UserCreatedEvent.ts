import { Topics } from "./topics";


export interface UserCreatedEvent {
  topic: Topics.UserCreated;
  data: {
    id: string;
  };
}

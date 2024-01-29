import { Topics } from "./topics";


export interface UserCreatedEvent {
  subject: Topics.UserCreated;
  data: {
    email: string;
  };
}

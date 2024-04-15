import { Topics } from "./topics";


export interface UserUpdateEvent {
  topic: Topics.UserUpdated;
  data: {
    name?: string;
    profileImage?: string;
  };
}
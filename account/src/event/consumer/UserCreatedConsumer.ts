import { Kafka, EachMessagePayload } from 'kafkajs';
import { Topics, BaseConsumer, UserCreatedEvent } from '@uniplanet-lib/common';
import Account from '../../models/account';

// Extend the BaseConsumer for the user:created event
export default class UserCreatedConsumer extends BaseConsumer<UserCreatedEvent> {
    topic:Topics.UserCreated = Topics.UserCreated;

    constructor(kafka:Kafka, groupId:string){
        super(kafka,groupId);
    }
    // Implement the onMessage method
    async onMessage(data: UserCreatedEvent['data']): Promise<void> {
        // Process the user:created message, e.g., send an email
        console.log(`user Created ${data.email} -- account server`);
        console.log(data)
        const account = Account.build({ 
            email: data.email,
            name: data.name,
            school: data.school
        })
        await account.save();
        console.log('account created successfully');
        
    }
}

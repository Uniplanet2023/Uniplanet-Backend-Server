import { Kafka, EachMessagePayload } from 'kafkajs';
import { Topics, BaseConsumer, UserCreatedEvent } from '@uniplanet-lib/common';
import Account from '../../models/account';
import { profile } from 'console';
import { redisClient } from '../../redis-client';
import GetAccountInfo from '../serializer/get-account';

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
            _id: data.id,
        })
        await account.save();
        console.log(account._id);
        console.log(data.id);
        await redisClient.redis.set(data.id, JSON.stringify(data));
        console.log('account created successfully');
        
    }
}

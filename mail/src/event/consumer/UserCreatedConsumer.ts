import { Kafka, EachMessagePayload } from 'kafkajs';
import { Topics, BaseConsumer, UserCreatedEvent } from '@uniplanet-lib/common';
import { EmailSender } from '../../email-sender';

// Extend the BaseConsumer for the user:created event
export default class UserCreatedConsumer extends BaseConsumer<UserCreatedEvent> {
    topic:Topics.UserCreated = Topics.UserCreated;

    constructor(kafka:Kafka, groupId:string){
        super(kafka,groupId);
    }
    // Implement the onMessage method
    async onMessage(data: UserCreatedEvent['data']): Promise<void> {
        // Process the user:created message, e.g., send an email
        console.log(`Sending email to user ${data.email}`);
        const emailSender = EmailSender.getInstance()
        const { status, hash } = await emailSender.sendSignUpVerificationEmail({
            name: data.name,
            toEmail: data.email,
        })    
        // Here you would actually send the email...
    }
}

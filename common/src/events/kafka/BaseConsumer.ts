import { Kafka, EachMessagePayload } from 'kafkajs';
import { Topics } from './topics';

interface Event {
    topic: Topics;
    data: any;
}

export abstract class BaseConsumer<T extends Event> {
    abstract topic: T['topic'];
    abstract onMessage(data: T['data']): void;
    private client: Kafka;
    private consumer;

    constructor(client: Kafka, groupId: string) {
        this.client = client;
        this.consumer = this.client.consumer({ groupId });
    }

    async connect() {
        await this.consumer.connect();
        await this.consumer.subscribe({ topic: this.topic, fromBeginning: true });
        await this.consumer.run({
            eachMessage: async (message: EachMessagePayload) => {
                console.log(`Received message on topic ${this.topic}`);
                // Check if the message value is not null
                if (message.message.value) {
                    const parsedData = JSON.parse(message.message.value.toString());
                    this.onMessage(parsedData);
                } else {
                    console.log('Received null message value, skipping...');
                }
            },
        });
        console.log(`Listening for messages on topic ${this.topic}`);
    }

    async disconnect() {
        await this.consumer.disconnect();
        console.log('Kafka Consumer disconnected');
    }
}

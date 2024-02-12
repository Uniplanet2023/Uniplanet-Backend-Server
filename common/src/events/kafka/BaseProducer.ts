import { Kafka, CompressionTypes } from 'kafkajs'
import { Topics } from './topics';

interface Event{
    topic: Topics;
    data: any;
}

export abstract class BaseProducer<T extends Event> {
    abstract topic: T['topic'];
    private client: Kafka;
    private producer;

    constructor(client:Kafka) {
        this.client = client;
        this.producer = this.client.producer();
    }

    async connect() {
        await this.producer.connect();
        console.log('Kafka Producer connected');
    }

    async sendMessage(data: T['data']): Promise<void> {
        try {
            const messages = [{ value: JSON.stringify(data) }];
            await this.producer.send({
                topic: this.topic,
                messages,
				acks: -1,
				compression: CompressionTypes.GZIP,
            });
            console.log('Event published to topic', this.topic);
        } catch (error) {
            console.error('Error in publishing event', error);
            throw error;
        }
    }

    async disconnect() {
        await this.producer.disconnect();
        console.log('Kafka Producer disconnected');
    }
}


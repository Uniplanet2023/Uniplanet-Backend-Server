import { redisClient } from "@uniplanet-lib/common";
import { Queue } from "bullmq";
const BATCH_SIZE = 40;  // Number of emails to send in each batch

// Set up BullMQ Queue with Redis connection
const emailQueue = new Queue('emailQueue', {
    connection: {
      host: process.env.REDIS_HOST!,
      port: parseInt(process.env.REDIS_PORT!),
      password: redisClient.redis.options?.password, // Use password if applicable
      db: redisClient.redis.options?.database, // Use specific DB if applicable
    },
  });
  
  // Function to add email jobs to the queue
  export async function queueEmails(emails: string[], title: string, html: string, description: string) {
    for (let i = 0; i < emails.length; i += BATCH_SIZE) {
      const batch = emails.slice(i, i + BATCH_SIZE);
      await emailQueue.add('sendEmails', {
        batch,
        title,
        html,
        description,
      });
      new Promise((resolve) => setTimeout(resolve, 10000));  // Delay between batches
      console.log('Email batch queued:');
    }
  }
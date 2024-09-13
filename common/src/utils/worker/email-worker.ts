import { redisClient } from '@uniplanet-lib/common';
import { Worker, ConnectionOptions } from 'bullmq';
import { app } from 'firebase-admin';
import { MAIL_DB, MAIL_QUEUE } from './queue-name';

export async function startMailWorker(firebaseAdmin: app.App) {
  // Create a worker with the same Redis connection options
  const connectionOptions: ConnectionOptions = {
    host: process.env.REDIS_HOST!,
    port: parseInt(process.env.REDIS_PORT!),
    password: redisClient.redis.options?.password, // Use password if applicable
    db: redisClient.redis.options?.database, // Use specific DB if applicable
  };

  const emailWorker = new Worker(
    MAIL_QUEUE,
    async job => {
      const { batch, title, html, description } = job.data;
      // Send the email batch
      const emailPromises = batch.map((email: string) => {
        return firebaseAdmin
          .firestore()
          .collection(MAIL_DB)
          .add({
            to: email,
            message: {
              subject: title,
              html: html || '', // Default to an empty string if not provided
              text: description || '', // Default to an empty string if not provided
            },
          });
      });

      await Promise.all(emailPromises);
    },
    {
      connection: connectionOptions, // Use the same connection options for the Worker
    }
  );

  emailWorker.on('completed', job => {
    console.log(`Job ${job.id} completed successfully`);
  });

  emailWorker.on('failed', (job, err) => {
    console.error(`Job ${job?.id} failed with error ${err.message}`);
  });
}
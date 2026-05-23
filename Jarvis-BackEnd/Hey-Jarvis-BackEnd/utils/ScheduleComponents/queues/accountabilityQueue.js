import { Queue } from 'bullmq';
import dotenv from 'dotenv';
dotenv.config();

// Instead of importing a connected redisClient
// just pass the connection config
export const accountabilityQueue = new Queue('accountability', {
  connection: {
    host: process.env.REDIS_END_POINT,
    port: Number(process.env.REDIS_PORT),
    password: process.env.REDIS_PASSWORD,
    tls: true
  }
});
console.log('Successfully created accountability queue');

export const randomisedQueue = new Queue('randomised', {
  connection: {
    host: process.env.REDIS_END_POINT,
    port: Number(process.env.REDIS_PORT),
    password: process.env.REDIS_PASSWORD,
    tls: true
  }
});
console.log(' Randomised queue created');

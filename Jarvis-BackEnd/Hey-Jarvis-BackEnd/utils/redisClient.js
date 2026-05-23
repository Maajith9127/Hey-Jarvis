import { createClient } from 'redis';
import dotenv from 'dotenv';
dotenv.config();

const redisClient = createClient({
  url:process.env.REDIS_URL,  // fill these in below
  socket: {
    tls: true,
  },
  disableClientSetInfo: true,
});
redisClient.on('error', (err) => {
  console.error('❌ Redis error:', err);
});

await redisClient.connect();
console.log('✅ Connected to Redis');
export default redisClient;
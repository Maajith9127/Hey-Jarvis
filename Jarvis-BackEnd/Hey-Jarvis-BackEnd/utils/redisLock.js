// utils/redisLock.js
import redisClient from './redisClient.js';



export async function acquireLock(key, ttl = 5000) {
  const result = await redisClient.set(`lock:${key}`, 'locked', {
    NX: true,
    PX: ttl
  });
  return result === 'OK';
}

export async function releaseLock(key) {
  await redisClient.del(`lock:${key}`);
}

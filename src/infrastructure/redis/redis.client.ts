import { Redis } from 'ioredis';

export const redisClient = new Redis({
  host: 'redis',
  port: 6379,
  maxRetriesPerRequest: null,
});

redisClient.on('connect', () => {
  console.log('Redis connected');
});

redisClient.on('error', (err) => {
  console.log('An error occured in redis', err);
});

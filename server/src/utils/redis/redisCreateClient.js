import redis from 'redis';

export default () => {
  const redisOptions = {};
  if (process.env.REDIS_URL) {
    // Allow EB envs to include elasticache urls :)
    redisOptions.url = process.env.REDIS_URL;
  }

  return redis.createClient(redisOptions);
};

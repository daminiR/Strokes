import { RedisPubSub } from 'graphql-redis-subscriptions';
import 'dotenv/config'
const domain = process.env.REDIS_AWS as any
const port = process.env.PORT_NUMBER as any
export const pubsub = new RedisPubSub({
  connection: {
    host:'chatcluster.kxyrsy.ng.0001.use1.cache.amazonaws.com' ,
    port: '6379',
    retry_strategy: (options) => {
      return Math.max(options.attempt * 100, 3000)
    },
  },
});

console.log("redis", pubsub)

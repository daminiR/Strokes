import { RedisPubSub } from 'graphql-redis-subscriptions';
import 'dotenv/config'
const domain = process.env.REDIS_DOMAIN_NAME
const port = process.env.PORT_NUMBER
//export const pubsub = new RedisPubSub()
export const pubsub = new RedisPubSub({
  connection: {
    host: 'localhost',
    port: '6379',
    retry_strategy: (options) => {
      return Math.max(options.attempt * 100, 3000)
    },
  },
});

console.log("redis", pubsub)

//#TODO: Why does ES6 syntax provide perfomrance benefits?
import 'dotenv/config'
import  express from 'express';
import { ApolloServer, gql }  from 'apollo-server-express';
import  mongoose from 'mongoose';
import { resolvers } from './resolvers/resolvers'
import {graphqlUploadExpress} from 'graphql-upload'
import { typeDefs } from './typeDefs/typeDefs';
import { Storage } from '@google-cloud/storage'
import * as path from 'path'
//import { pubsub } from './pubsub'
import { PubSub } from 'graphql-subscriptions';


import { createServer } from 'http';
import { execute, subscribe } from 'graphql';
import { SubscriptionServer } from 'subscriptions-transport-ws';
import { makeExecutableSchema } from '@graphql-tools/schema';

export const googleCloud = new Storage({
  keyFilename: "../backend/src/activitybook-a598b-782d9db5058e.json",
  projectId: "activitybook-a598b",
});

export const acsport1 = googleCloud.bucket('acsport1')
const startServer = async () => {
  const uri = process.env.ATLAS_URI;
  const app = express() as any
  app.use(graphqlUploadExpress())
  const httpServer = createServer(app)
  const schema = makeExecutableSchema({ typeDefs, resolvers });
  //const pubsub = new PubSub()
  const server = new ApolloServer({
    //typeDefs,
    //resolvers,
    //context: async ({ req, res }) => ({ req, res, pubsub }),
    schema,
    plugins: [
      {
        async serverWillStart() {
          return {
            async drainServer() {
              subscriptionServer.close();
            },
          };
        },
      },
    ],
  });
  await server.start()
  server.applyMiddleware({ app });
  console.log("path", server.graphqlPath)
  const subscriptionServer = SubscriptionServer.create({
   // This is the `schema` we just created.
   schema,
   // These are imported from `graphql`.
   execute,
   subscribe,
}, {
   // This is the `httpServer` we created in a previous step.
   server: httpServer,
   // This `server` is the instance returned from `new ApolloServer`.
   path: server.graphqlPath,
   //path: '/subscriptions',
});

  ////////////// cloud stuff //////////////
  googleCloud.getBuckets().then((x) => {
    console.log(x)
  }).catch((error) => {console.log(error)})
  ///////////////////////////////////////////


  ////////////// mongodb stuff //////////////////
  await mongoose.connect(uri!, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  //////////////////////////////////////////////
  httpServer.listen({ port: 4000 }, () =>
    console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
  );
};

startServer();

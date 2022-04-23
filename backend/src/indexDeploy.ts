//#TODO: Why does ES6 syntax provide perfomrance benefits?
import 'dotenv/config'
import  express from 'express';
import { ApolloServer, gql }  from 'apollo-server-lambda';
import  mongoose, {ConnectOptions} from 'mongoose';
import merge from 'lodash'
import { mergeResolvers } from '@graphql-tools/merge';
import {resolvers as deleteUser} from './resolvers/deleteUser'
import {resolvers as createUser} from './resolvers/createUSer'
import {resolvers as likesDislikes} from './resolvers/likesDislikes'
import {resolvers as matches} from './resolvers/matches'
import {resolvers as random} from './resolvers/random'
import {resolvers as testResolvers} from './resolvers/testResolvers'
import {resolvers as updateUser} from './resolvers/updateUser'
import {resolvers as uploads} from './resolvers/uploads'

import {graphqlUploadExpress} from 'graphql-upload'
import { Storage } from '@google-cloud/storage'
import { typeDefs } from './typeDefs/typeDefs';
import * as path from 'path'
import { createServer } from 'http';
import { execute, subscribe } from 'graphql';
import { SubscriptionServer } from 'subscriptions-transport-ws';
import { makeExecutableSchema } from '@graphql-tools/schema';
const gcStorageKeyFilename = process.env.gcStorageKeyFilename
const projectId = process.env.projectId

export const googleCloud = new Storage({
  keyFilename: './src/activitybook-a598b-782d9db5058e.json',
  projectId: 'activitybook-a598b',
});

export const acsport1 = googleCloud.bucket('acsport1')
const startServer = async () => {
  const uri = process.env.ATLAS_URI as any
  const app = express()
  app.use(graphqlUploadExpress())
  const resolvers2 = mergeResolvers(
    [
      createUser,
      deleteUser,
      likesDislikes,
      matches,
      random,
      testResolvers,
      updateUser,
      uploads,
    ]
  );
  const schema = makeExecutableSchema({
    typeDefs: typeDefs,
    resolvers: resolvers2,
  });
  const server = new ApolloServer({
    schema: schema,
  });
  server.createHandler()
  googleCloud.getBuckets().then((x) => {
    console.log(x)
  }).catch((error) => {console.log(error)})
  const uri2 = "mongodb+srv://damini:turing2030@cluster0.xmukg.mongodb.net/<dbname>?retryWrites=true&w=majority"
  mongoose
    .connect(uri2, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    } as ConnectOptions)
    .catch((error) => {
      console.log(error);
    });
  //exports.graphqlHandler = server.createHandler({
    //expressGetMiddlewareOptions: { bodyParserConfig: { limit: "50mb" } },
  //});
  exports.graphqlHandler = server.createHandler({
    expressAppFromMiddleware(middleware) {
      const app = express();
      app.use(graphqlUploadExpress());
      app.use(middleware);
      return app;
    },
  });
  console.log(`🚀 Server ready at aws only ts`)
};
startServer();

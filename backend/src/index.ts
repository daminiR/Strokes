//#TODO: Why does ES6 syntax provide perfomrance benefits?
import 'dotenv/config'
import  express from 'express';
import { ApolloServer, gql }  from 'apollo-server-express';
//import { ApolloServer, gql }  from 'apollo-server-lambda';
import  mongoose, {ConnectOptions} from 'mongoose';
//import { resolvers } from './resolvers/resolvers'
import merge from 'lodash'
// resolver list modulerized
import { mergeResolvers } from '@graphql-tools/merge';
import {resolvers as deleteUser} from './resolvers/deleteUser'
import {resolvers as createUser} from './resolvers/createUSer'
import {resolvers as likesDislikes} from './resolvers/likesDislikes'
import {resolvers as matches} from './resolvers/matches'
//import {resolvers as messaging} from './resolvers/messaging'
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
export const googleCloud = new Storage({
  keyFilename: "../backend/src/activitybook-a598b-782d9db5058e.json",
  projectId: "activitybook-a598b",
});

export const acsport1 = googleCloud.bucket('acsport1')
const startServer = async () => {
  const uri = process.env.ATLAS_URI as any
  const app = express()
  app.use(graphqlUploadExpress())
  const httpServer = createServer(app)
  const resolvers2 = mergeResolvers(
    [
      createUser,
      deleteUser,
      likesDislikes,
      matches,
      random,
      testResolvers,
      //messaging,
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
  await server.start()
  //server.createHandler()
  server.applyMiddleware({ app });
  //console.log("path", server.graphqlPath)
  //////////// cloud stuff //////////////
  googleCloud.getBuckets().then((x) => {
    console.log(x)
  }).catch((error) => {console.log(error)})
  ///////////////////////////////////////
  ////////// mongodb stuff //////////////////
  ////////////////////////////////////////////
  ////////// mongodb stuff //////////////////
  const uri2 = "mongodb+srv://damini:turing2030@cluster0.xmukg.mongodb.net/<dbname>?retryWrites=true&w=majority"
  mongoose.connect(uri2, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  } as ConnectOptions)
  .catch((error) => {console.log(error)})
  ////////////////////////////////////////////
  httpServer.listen({ port: 4000 }, () =>
    console.log(`🚀  Is this still running Server ready at http://localhost:4000${server.graphqlPath}`)
  );
  //exports.graphqlHandler = server.createHandler();
};
startServer();

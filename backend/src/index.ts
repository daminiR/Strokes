//#TODO: Why does ES6 syntax provide perfomrance benefits?
import 'dotenv/config'
import  express from 'express';
import { ApolloServer}  from 'apollo-server-express';
import  mongoose, {ConnectOptions} from 'mongoose';
import { mergeResolvers } from '@graphql-tools/merge';
import {resolvers as deleteUser} from './resolvers/deleteUser'
import {resolvers as createUser} from './resolvers/createUSer'
import {resolvers as likesDislikes} from './resolvers/likesDislikes'
import {resolvers as matches} from './resolvers/matches'
import {resolvers as testResolvers} from './resolvers/testResolvers'
import {resolvers as updateUser} from './resolvers/updateUser'
import {resolvers as uploads} from './resolvers/uploads'
import {resolvers as update} from './resolvers/admin_resolvers/update_schema'

import * as sendbird from "sendbird-platform-sdk-typescript";
import {graphqlUploadExpress} from 'graphql-upload'
import { typeDefs } from './typeDefs/typeDefs';
import { createServer } from 'http';
import { makeExecutableSchema } from '@graphql-tools/schema';
const appId = "FFBBD532-7319-41BD-A32A-26F6D6BCA74C"
const startServer = async () => {
  const uri = process.env.ATLAS_URI as any
  const collectionName = process.env.COLLECTION_NAME as any
  const app = express()
  app.use(graphqlUploadExpress());
  const httpServer = createServer(app);
  const serverConfig = new sendbird.ServerConfiguration("https://api-{app_id}.sendbird.com", { "app_id": appId })
  const configuration = sendbird.createConfiguration({ baseServer : serverConfig });
  const resolvers2 = mergeResolvers(
    [
      createUser,
      deleteUser,
      likesDislikes,
      testResolvers,
      matches,
      updateUser,
      uploads,
      update
    ]
  );
  const schema = makeExecutableSchema({
    typeDefs: typeDefs,
    resolvers: resolvers2,
  });
  const server = new ApolloServer({
    schema: schema,
    context: async ({ req }) => {
    }
  });
  await server.start()
  server.applyMiddleware({ app });
  mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  } as ConnectOptions)
  .catch((error) => {console.log(error)})
  httpServer.listen({ port: 4000 }, () => {
    console.log(`Collection Name:${collectionName}`)
    console.log(
      `🚀  Is this still running Server ready at http://localhost:4000${server.graphqlPath}`
    )
  });
};
startServer();

//#TODO: Why does ES6 syntax provide perfomrance benefits?
import 'dotenv/config'
import  express from 'express';
import { ApolloServer, gql }  from 'apollo-server-lambda';
import  mongoose, {ConnectOptions} from 'mongoose';
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
import { typeDefs } from './typeDefs/typeDefs';
import * as path from 'path'
import { makeExecutableSchema } from '@graphql-tools/schema';

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
  mongoose
    .connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    } as ConnectOptions)
    .catch((error) => {
      console.log(error);
    });
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

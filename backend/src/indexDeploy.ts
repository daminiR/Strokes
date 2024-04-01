//#TODO: Why does ES6 syntax provide perfomrance benefits?
import 'dotenv/config'
import  express from 'express';
import { ApolloServer, gql }  from 'apollo-server-lambda';
import  mongoose, {ConnectOptions} from 'mongoose';
import { mergeResolvers } from '@graphql-tools/merge';
import {resolvers as deleteUser} from './resolvers/prod/deleteUser'
import {resolvers as createUser} from './resolvers/prod/createUSer'
import {resolvers as likesDislikes} from './resolvers/prod/likesDislikes'
import {resolvers as matches} from './resolvers/prod/matches'
import {resolvers as updateUser} from './resolvers/prod/updateUser'
import {resolvers as uploads} from './resolvers/prod/uploads'

import {graphqlUploadExpress} from 'graphql-upload'
import { typeDefs } from './typeDefs/prod/typeDefs';
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
      //random,
      updateUser,
      uploads
    ]
  );
  const schema = makeExecutableSchema({
    typeDefs: typeDefs,
    resolvers: resolvers2,
  });
  const server = new ApolloServer({
    schema: schema,
    context: async ({ event, context, express }) => {
      return "Context when needed"
    },
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
  console.log(`🚀 Server ready at aws only ts new changes to  test`)
};
startServer();

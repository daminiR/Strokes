//#TODO: Why does ES6 syntax provide perfomrance benefits?
import 'dotenv/config'
import  express from 'express';
import { ApolloServer}  from 'apollo-server-express';
import  mongoose, {ConnectOptions} from 'mongoose';
import { mergeResolvers } from '@graphql-tools/merge';
import {resolvers as deleteUser} from './resolvers/prod/User/deleteUser'
import {resolvers as createUser} from './resolvers/prod/User/createUser'
import {resolvers as likesDislikes} from './resolvers/prod/User/likesDislikes'
import {resolvers as matches} from './resolvers/prod/User/matches'
import {resolvers as updateUser} from './resolvers/prod/User/updateUser'
import {resolvers as uploads} from './resolvers/prod/User/uploads'
import {resolvers as update} from './resolvers/admin/update_schema'
import {resolvers as testCreateUser} from './resolvers/test/createUser'
import {resolvers as testUpload} from './resolvers/test/updateUser'

import {resolvers as  addLikeResolvers} from './resolvers/prod/likes/addLike'
import {resolvers as  createReportResolvers} from './resolvers/prod/reports/createReport'
import {resolvers as removeLikeResolvers} from './resolvers/prod/likes/removeLike'
import {resolvers as queryLikedResolvers} from './resolvers/prod/likes/queryLikes'

import {resolvers as  matchResolvers} from './resolvers/prod/matches/updateMatches'

import { resolvers as potentialMatchPoolResolvers } from "./resolvers/prod/potentialMatchPools/updatePotentialMatchPool";

import {graphqlUploadExpress} from 'graphql-upload'
import { typeDefs } from './typeDefs/prod/typeDefs';
import { typeDefsTest } from './typeDefs/test/typeDefs'
import { likesTypeDefs } from './typeDefs/prod/likesTypeDefs'
import { reportTypeDefs } from './typeDefs/prod/reportsTypeDefs'
import { matchesTypeDefs } from "./typeDefs/prod/matchesTypeDefs";
import { potentialMatchPoolTypeDefs } from "./typeDefs/prod/matchPoolTypeDefs";
import { createServer } from 'http';
import { makeExecutableSchema } from '@graphql-tools/schema';
const startServer = async () => {
  const uri = process.env.ATLAS_URI as any
  const collectionName = process.env.COLLECTION_NAME as any
  const app = express()
  app.use(graphqlUploadExpress());
  const httpServer = createServer(app);
  const resolvers2 = mergeResolvers(
    [
      createUser,
      deleteUser,
      likesDislikes,
      matches,
      updateUser,
      uploads,
      update,
      //match collection
      matchResolvers,
      //likes collection
      addLikeResolvers,
      removeLikeResolvers,
      queryLikedResolvers,
      // report users
      createReportResolvers,
      // tests
      testCreateUser,
      testUpload
    ]
  );
  const schema = makeExecutableSchema({
    typeDefs: [typeDefs, typeDefsTest, likesTypeDefs, reportTypeDefs, matchesTypeDefs, potentialMatchPoolTypeDefs],
    resolvers: resolvers2,
  });
  const server = new ApolloServer({
    schema: schema,
    context: async ({ req }) => {},
  });
  await server.start()
  server.applyMiddleware({ app: app as any });
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

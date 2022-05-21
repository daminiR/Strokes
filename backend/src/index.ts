//#TODO: Why does ES6 syntax provide perfomrance benefits?
import 'dotenv/config'
import  express from 'express';
import { ApolloServer, gql }  from 'apollo-server-express';
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

import admin = require("firebase-admin")
import {getAuth} from "firebase-admin/auth"
//import { initializeApp } from 'firebase-admin/app';

import {graphqlUploadExpress} from 'graphql-upload'
import { typeDefs } from './typeDefs/typeDefs';
import { createServer } from 'http';
import { makeExecutableSchema } from '@graphql-tools/schema';

const serviceAccount = process.env.gcStorageKeyFilename as any
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});
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
    context: ({ req }) => {
      // Get the user token from the headers.
      const authReq = req.headers.authorization || "";
      const token = authReq.split('Bearer ')[1] || ""
      // Try to retrieve a user with the token and verify
      var user = null as any;
      getAuth()
      //admin
        //.auth()
        .verifyIdToken(token)
        .then((decodedToken) => {
          console.log("Token verified");
          user = decodedToken
        })
        .catch((err) => {
          console.log("Token Verification failed");
          console.log(err);
        });
      // Add the user to the context
      return { user };
    },
  });
  await server.start()
  server.applyMiddleware({ app });
  mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  } as ConnectOptions)
  .catch((error) => {console.log(error)})
  httpServer.listen({ port: 4000 }, () =>
    console.log(`🚀  Is this still running Server ready at http://localhost:4000${server.graphqlPath}`)
  );
};
startServer();

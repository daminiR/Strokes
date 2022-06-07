//#TODO: Why does ES6 syntax provide perfomrance benefits?
import 'dotenv/config'
import  express from 'express';
import { ApolloServer, AuthenticationError }  from 'apollo-server-express';
import  mongoose, {ConnectOptions} from 'mongoose';
import { mergeResolvers } from '@graphql-tools/merge';
import {resolvers as deleteUser} from './resolvers/deleteUser'
import {resolvers as createUser} from './resolvers/createUSer'
import {resolvers as likesDislikes} from './resolvers/likesDislikes'
import {resolvers as matches} from './resolvers/matches'
import {resolvers as random} from './resolvers/random'
import {resolvers as updateUser} from './resolvers/updateUser'
import {resolvers as uploads} from './resolvers/uploads'

import {graphqlUploadExpress} from 'graphql-upload'
import { typeDefs } from './typeDefs/typeDefs';
import { createServer } from 'http';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { CognitoJwtVerifier } from "aws-jwt-verify"

const verifier = CognitoJwtVerifier.create({
  userPoolId: "us-east-1_idvRudgcB", // Your user pool id here
  tokenUse: "access",
  clientId: "5db5ndig7d4dei9eiviv06v59f", // Your client id here
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
    context: async ({ req }) => {
      // Get the user token from the headers.
      console.log("Token")
      var user = null as any
      const authReq = req.headers.authorization || "";
      const token = authReq.split('Bearer ')[1] || ""
      // Try to retrieve a user with the token and verify
      console.log("Token", token)
      if (token) {
        console.log("did we make it here");
        const payload = await verifier.verify(token)
        user = payload
        return {user}
      } else {
        user = null;
      return { user }
      }
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

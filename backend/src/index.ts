//#TODO: Why does ES6 syntax provide perfomrance benefits?
import 'dotenv/config'
import  express from 'express';
import { ApolloServer, gql }  from 'apollo-server-express';
import  mongoose from 'mongoose';
import { resolvers } from './resolvers/resolvers'
import { graphqlUploadExpress } from 'graphql-upload'
import { typeDefs } from './typeDefs/typeDefs';
import { Storage } from '@google-cloud/storage'
import * as path from 'path'

export const googleCloud = new Storage({
  keyFilename: "../backend/src/activitybook-a598b-782d9db5058e.json",
  projectId: "activitybook-a598b",
});
export const acsport1 = googleCloud.bucket('acsport1')
const startServer = async () => {
  const uri = process.env.ATLAS_URI;
  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });
  await server.start()
  const app = express()

  googleCloud.getBuckets().then((x) => {
    console.log(x)
  }).catch((error) => {console.log(error)})
  app.use(graphqlUploadExpress())
  app.use(express.urlencoded())
  server.applyMiddleware({ app });
  await mongoose.connect(uri!, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  console.log()
  app.listen({ port: 4000 }, () =>
    console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
  );
};

startServer();

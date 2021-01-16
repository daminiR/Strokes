//#TODO: Why does ES6 syntax provide perfomrance benefits?
import  express from 'express';
import { ApolloServer, gql }  from 'apollo-server-express';
import  mongoose from 'mongoose';
import { resolvers } from './resolvers/resolvers'
import { typeDefs } from './typeDefs/typeDefs';
import 'dotenv/config';

const startServer = async () => {
  const app = express();
  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });

  server.applyMiddleware({ app });
  //config();
  // #TODO: fix for now, transfer to .env => security issue
  const uri = process.env.ATLAS_URI;
  await mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  app.use((req, res) => {
    res.status(200);
    res.send("Hello!");
    res.end();
  });

  app.listen({ port: 4000 }, () =>
    console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
  );
};

startServer();

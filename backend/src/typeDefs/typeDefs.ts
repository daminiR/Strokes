import {gql} from 'apollo-server-express';
export const typeDefs = gql`
  type Query {
    hello: String!
  }
  type Squash {
    first_name: String!
  }
  type Mutation {
    createSquash(
      first_name: String!
    ): Squash!
  }
`;

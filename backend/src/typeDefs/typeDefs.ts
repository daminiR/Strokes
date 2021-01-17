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
      age: Int!
      gender: String!
      sports: String!
      game_level:String!
      country: String!
      description: String!
      image_set: String!

    ): Squash!
  }
`;

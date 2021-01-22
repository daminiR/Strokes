import {gql} from 'apollo-server-express';
export const typeDefs = gql`
  type Query {
    hello: String!
  }
  type Squash {
    first_name: String!
  }
  input SquashNode {
    sport: String!
    isUserSport: Boolean
  }
  type Mutation {
    createSquash(
      first_name: String!
      age: Int!
      gender: String!
      sports: [SquashNode!]!
      game_level: String!
      country: String
      description: String
      image_set: [String!]!
    ): Squash!
  }
`;

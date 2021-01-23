import {gql} from 'apollo-server-express';
//TODO: change inout ype for age to be Int! but after you configure the birthdate resolver
//TODO: need to add apollo server error handling
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
      age: String!
      gender: String!
      sports: [SquashNode!]!
      game_level: String!
      country: String
      description: String
      image_set: [String!]!
    ): Squash!
  }
`;

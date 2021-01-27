import {gql} from 'apollo-server-express';
//TODO: change inout ype for age to be Int! but after you configure the birthdate resolver
//TODO: need to add apollo server error handling
export const typeDefs = gql`
  type Query {
    hello: String!
    squash(id: ID!): Squash!
    squashes(limit: Int): [Squash!]
  }
  type Squash {
    first_name: String!
    _id: ID!
  }
  input SquashNode {
    sport: String!
    isUserSport: Boolean
  }
  type Mutation {
    createSquash(
      _id: String!
      first_name: String!
      age: String!
      gender: String!
      sports: [SquashNode!]!
      game_level: String!
      country: String
      description: String
      image_set: [String!]!
    ): Squash!
    deleteSquash(_id: String): Squash!
  }
`;

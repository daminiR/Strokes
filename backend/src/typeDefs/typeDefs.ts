import {gql} from 'apollo-server-express';
//TODO: change inout ype for age to be Int! but after you configure the birthdate resolver
//TODO: need to add apollo server error handling
export const typeDefs = gql`
scalar FileUpload
  type Query {
    hello: String!
    squash(id: String!): Squash!
    squashes(limit: Int): [Squash!]
    display(filaname: String): String
  }
  type Squash {
    first_name: String!
    _id: ID!
  }
  input SquashNode {
    sport: String!
    isUserSport: Boolean
  }
  input Data {
    img_idx:  Int!
    imageURL: String!
  }
  type Mutation {
    uploadFile(file: FileUpload!, _id: String, img_idx: Int): Squash
    createSquash(
      _id: String!
      first_name: String!
      age: String!
      gender: String!
      sports: [SquashNode!]!
      game_level: String!
      country: String
      description: String
      image_set: [Data!]!
    ): Squash!
    deleteSquash(_id: String): Squash!
  }
`;

import {gql} from 'apollo-server-express';
//TODO: change inout ype for age to be Int! but after you configure the birthdate resolver
//TODO: need to add apollo server error handling
 const SquashNodeType = `
    sport: String!,
    game_level: Int!,
`
  const DataType = `
    img_idx: Int!,
    imageURL: String!,
    filePath: String!
`
export const typeDefs = gql`
  scalar FileUpload
  type Query {
    hello: String!
    squash(id: String!): Squash!
    squashes(limit: Int): [Squash!]
    display(filaname: String): String
  }
  input SquashNodeInput {
    ${SquashNodeType}
  }
  type SquashNode {
    ${SquashNodeType}
  }
  type Squash {
    first_name: String!
    _id: ID!
    age: String!
    gender: String!
    sports: [SquashNode!]!
    country: String
    description: String
    image_set: [Data!]!
  }
  type DisplayImage {
    imageURL: String!
    filePath: String!
  }
  input DataInput{
    ${DataType}
  }
  type DataOutput{
    imageURL: String!
    filePath: String!
  }
  type Data{
    ${DataType}
  }
  type Mutation {
    deleteImage(_id: String, img_idx: Int): [Data!]!
    updateUserSports(_id: String!, sportsList: [SquashNodeInput!]!): String
    uploadFile(file: FileUpload!, _id: String, img_idx: Int): DisplayImage
    createSquash(
      _id: String!
      first_name: String!
      age: String!
      gender: String!
      sports: [SquashNodeInput!]!
      country: String
      description: String
      image_set: [DataInput!]!
    ): Squash!
    deleteSquash(_id: String): Squash!
  }
`;

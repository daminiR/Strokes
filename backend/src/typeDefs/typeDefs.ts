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
  const ImageData = `
    img_idx: Int!,
    file: FileUpload!
`
const SquashType = `
    first_name: String!
    last_name: String!
    _id: ID!
    age: Int!
    gender: String!
    sports: [SquashNode!]!
    country: String
    description: String
    image_set: [Data!]!
  matched : [Squash]!
  blocked_me : [Squash]!
  i_blocked : [Squash]!
  likes : [Squash]!
  dislikes : [Squash]!
  `
const SquashInputType = `
    first_name: String!
    last_name: String!
    _id: ID!
    age: Int!
    gender: String!
    sports: [SquashNodeInput!]!
    country: String
    description: String
    image_set: [DataInput!]!
    matched : [SquashInput]!
    blocked_me : [SquashInput]!
    i_blocked : [SquashInput]!
    likes : [SquashInput]!
    dislikes : [SquashInput]!
  `

export const typeDefs = gql`
  scalar FileUpload
  type Query {
    hello: String!
    squash(id: String!): Squash!
    squashes(limit: Int): [Squash!]
    display(filaname: String): String
    queryProssibleMatches(_id: String!): [Squash!]
  }
  input SquashNodeInput {
    ${SquashNodeType}
  }
  type SquashNode {
    ${SquashNodeType}
  }
  type Squash {
      ${SquashType}
  }
  input SquashInput {
      ${SquashInputType}
  }
  type DisplayImage {
    imageURL: String!
    filePath: String!
  }
  input DataInput{
    ${DataType}
  }
  input ImageData{
    ${ImageData}
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
    updateName(_id: String!, first_name: String!, last_name: String): String
    updateAge(_id: String!, age: Int): String
    updateGender(_id: String!, gender: Int): String
    updateDescription(_id: String!, description: String!): String
    uploadFile(file: FileUpload!, _id: String, img_idx: Int): DisplayImage
    updateUserProfile(
      _id: String!
      first_name: String!
      last_name: String!
      age: Int!
      gender: String!
      sports: [SquashNodeInput!]!
      country: String
      description: String!
      add_local_images: [ImageData],
      remove_uploaded_images: [DataInput],
      original_uploaded_image_set: [DataInput!]!,
    ): Squash
    createSquash2(
      _id: String!
      first_name: String!
      last_name: String!
      age: Int!
      gender: String!
      sports: [SquashNodeInput!]!
      country: String
      description: String!
      image_set: [ImageData!]!
    matched : [SquashInput]!
  blocked_me : [SquashInput]!
  i_blocked : [SquashInput]!
  likes : [SquashInput]!
  dislikes : [SquashInput]!
    ): Squash!
    deleteSquash(_id: String): Squash!
  }
`;

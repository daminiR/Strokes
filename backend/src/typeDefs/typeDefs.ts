import {gql} from 'apollo-server-express';
//TODO: change inout ype for age to be Int! but after you configure the birthdate resolver
//TODO: need to add apollo server error handling
//TODO: ADD enum check for states and countt maybe
 const LocationType = `
    city: String!,
    state: String!,
    country: String!
`;
 const MessageType = `
 _id: ID!,
 sender: String!,
 receiver: String!,
 text: String!
`;
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
const PotentialMatchUserType = `
    _id: ID!
    first_name: String!
    age: Int!
    gender: String!
    sports: [SquashNode!]!
    description: String
    image_set: [Data!]!
`
const PotentialMatchUserInputType = `
    _id: ID!
    first_name: String!
    age: Int!
    gender: String!
    sports: [SquashNodeInput!]!
    description: String
    image_set: [DataInput!]!
`
const SquashType = `
    first_name: String!
    last_name: String!
    _id: ID!
    age: Int!
    gender: String!
    sports: [SquashNode!]!
    location: Location!
    description: String
    image_set: [Data!]!
    matches : [PotentialMatch!]
    blocked_me : [PotentialMatch!]
    i_blocked : [PotentialMatch!]
    likes : [PotentialMatch!]
    dislikes : [PotentialMatch!]
    likedByUSers: [PotentialMatch!]
  `

const SquashInputType = `
    first_name: String!
    last_name: String!
    _id: ID!
    age: Int!
    gender: String!
    sports: [SquashNodeInput!]!
    location: LocationInput!
    description: String
    image_set: [DataInput!]!
    matches : [PotentialMatchInput!]
    blocked_me : [PotentialMatchInput!]
    i_blocked : [PotentialMatchInput!]
    likes : [PotentialMatchInput!]
    dislikes : [PotentialMatchInput!]
    likedByUSers: [PotentialMatchInput!]
  `

export const typeDefs = gql`
  type Message {
    ${MessageType}
  }
  type Location {
    ${LocationType}
  }
  input LocationInput {
    ${LocationType}
  }
  scalar FileUpload
  type Query {
    messages(currentUserID: String!, matchedUserID:String!): [Message!]
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
  type PotentialMatch {
      ${PotentialMatchUserType}
  }
  input PotentialMatchInput {
      ${PotentialMatchUserInputType}
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
  type Result {
    _id: String!
    }
  type Message2 {
    sender: String!
    }
  type Subscription {
    messagePosted: Message
  }

  type Mutation {
    deleteImage(_id: String, img_idx: Int): [Data!]!
    updateUserSports(_id: String!, sportsList: [SquashNodeInput!]!): String
    updateName(_id: String!, first_name: String!, last_name: String): String
    updateAge(_id: String!, age: Int): String
    updateGender(_id: String!, gender: Int): String
    updateDescription(_id: String!, description: String!): String
    uploadFile(file: FileUpload!, _id: String, img_idx: Int): DisplayImage

    updateLocation(check: String): String

    updateLikes(_id: String!, likes: [PotentialMatchInput!], currentUserData: PotentialMatchInput!): Squash
    updateDislikes(_id: String!, dislikes: [PotentialMatchInput!]): Squash
    updateMatches(currentUserId: String!, potentialMatchId: String!, currentUser: PotentialMatchInput, potentialMatch: PotentialMatchInput): Squash

    postMessage2(sender: String, receiver: String, text: String): ID!

    updateUserProfile(
      _id: String!
      first_name: String!
      last_name: String!
      age: Int!
      gender: String!
      sports: [SquashNodeInput!]!
      location:LocationInput!
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
      location: LocationInput!
      description: String!
      image_set: [ImageData!]!
      matches : [PotentialMatchInput!]
      blocked_me : [PotentialMatchInput!]
      i_blocked : [PotentialMatchInput!]
      likes : [PotentialMatchInput!]
      dislikes : [PotentialMatchInput!]
      likedByUSers: [PotentialMatchInput!]
    ): Squash!

    createSquashTestSamples(
      _id: String!
      first_name: String!
      last_name: String!
      age: Int!
      gender: String!
      sports: [SquashNodeInput!]!
      location: LocationInput!
      description: String!
      image_set: [DataInput!]!
    ): Squash!

    deleteSquash(_id: String): Squash!

    testMut(name: Int!):Int
  }
`;

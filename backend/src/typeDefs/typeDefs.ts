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
 const DeletedType = `
 isDeleted: Boolean,
 deletedAt: String,
`;
 const SquashNodeType = `
    sport: String!,
    game_level: String!,
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
  const ageRange = `
    minAge: Int!,
    maxAge: Int!
`
const PotentialMatchUserType = `
    _id: ID!
    first_name: String!
    age: Int!
    gender: String!
    sports: [SquashNode!]!
    description: String
    location: LocationType!
    image_set: [Data!]!
`
const LikedByUserType = `
    _id: ID!
    first_name: String!
    age: Int!
    profileImage: Data
`
const LikedByUserInputType = `
    _id: ID!
    first_name: String!
    age: Int!
    profileImage: DataInput
`
const userExistT = `
    isPhoneExist: Boolean!
    isDeleted: Boolean!
`
export const PotentialMatchUserInputType = `
    _id: ID!
    first_name: String!
    age: Int!
    gender: String!
    sports: [SquashNodeInput!]!
    description: String
    image_set: [DataInput!]!
    location: LocationInput!
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
    likes : [String!]
    swipesPerDay: Int!
    dislikes : [String!]
    likedByUSers: [LikedByUser!]
    deleted: DeletedT
    phoneNumber: String
    email: String
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
    deleted: DeletedInput
    matches : [PotentialMatchInput!]
    blocked_me : [PotentialMatchInput!]
    i_blocked : [PotentialMatchInput!]
    likes : [String!]
    dislikes : [String!]
    swipesPerDay: Int!
    likedByUSers: [LikedByUserInput!]
    phoneNumber: String
    email: String
  `

export const typeDefs = gql`
  type Message {
    ${MessageType}
  }
  type Location {
    ${LocationType}
  }
  input AgeRangeInput {
    ${ageRange}
  }
  type DeletedT {
    ${DeletedType}
  }
  input DeletedInput {
    ${DeletedType}
  }
  input LocationInput {
    ${LocationType}
  }
  type LocationType {
    ${LocationType}
  }
  input LikedByUserInput {
    ${LikedByUserInputType}
  }
  type LikedByUser {
    ${LikedByUserType}
  }
  type userExistType {
    ${userExistT}
  }
  scalar FileUpload
  type Query {
    messages(currentUserID: String!, matchedUserID:String!): [Message!]
    hello: String!
    squash(id: String!): Squash
    squashes(limit: Int): [Squash!]
    display(filaname: String): String
    checkPhoneInput (phoneNumber: String!): userExistType!
    queryProssibleMatches(_id: String!, offset: Int, limit: Int, location: LocationInput!, sport: String!, game_levels:[String!]!, ageRange: AgeRangeInput): [Squash!]
    matchesNotOptim(_id: String!, offset: Int, limit: Int, location: LocationInput!, sport: String!, game_levels:[String!]!, ageRange: AgeRangeInput): [Squash!]
    getSwipesPerDay(_id: String!): Int!
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

    updateLikes(_id: String!, likes: [String!], currentUserData: PotentialMatchInput!): Squash
    updateDislikes(_id: String!, dislikes: [String!]): Squash
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
      likes : [String!]
      dislikes : [String!]
      likedByUSers: [String!]
      phoneNumber: String
      email: String
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

    updateUserProfileTestSamples(
      _id1: String!
      _id2: String!
    ): Squash
    updateGameLevelsToStrings: String
    deleteSquash(_id: String, image_set: [DataInput!]): Boolean!
    softDeleteUser(_id: String): String
    deleteChatUser(_idUser: String, _idChatUser: String): String
    testMut(name: Int!):Int
    updateLikesTestSamples(_id: String!, likes: [String!]): Squash
    updateLikesCurrentUserTestSamples(_id: String!, likes: [LikedByUserInput!]): Squash
  }
`;

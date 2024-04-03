import { gql } from "apollo-server-lambda";
import {
  LocationType,
  MessageType,
  DeletedType,
  SquashNodeType,
  DataType,
  ImageData,
  FilterType,
  MatchQueueType,
  GameLevelRangeType,
  FileUploadType,
  AgeRangeType,
  PotentialMatchUserType,
  LikedByUserType,
  LikedByUserInputType,
  userExistT,
  PotentialMatchUserInputType,
  SquashType,
  SquashInputType,
} from '../../types/UserDefs'
//TODO: change inout ype for age to be Int! but after you configure the birthdate resolver
//TODO: need to add apollo server error handling
//TODO: ADD enum check for states and countt maybe
export const typeDefs = gql`
  type Message {
    ${MessageType}
  }
  type Location {
    ${LocationType}
  }
  input AgeRangeInput {
    ${AgeRangeType}
  }
  input GameLevelRangeInput {
    ${GameLevelRangeType}
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
  input FileUploadInput {
    ${FileUploadType}
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
    messages(currentUserID: String!, matchedUserID:String!, offset: Int!, limit: Int!): [Message!]
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
  input MatchQueueInput {
      ${MatchQueueType}
  }
  type MatchQueue {
      ${MatchQueueType}
  }
  input FilterInput {
      ${FilterType}
  }
  type Filter {
      ${FilterType}
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
    updateAllUserSchema(_id: String!): String
    deleteImage(_id: String, img_idx: Int): [Data!]!

    updateLikes(_id: String!, likes: [String!], currentUserData: PotentialMatchInput!, isFromLikes: Boolean!): Squash
    updateDislikes(_id: String!, dislikes: [String!], isFromLikes: Boolean!): Squash
    updateMatches(currentUserId: String!, potentialMatchId: String!, currentUser: PotentialMatchInput, potentialMatch: PotentialMatchInput): Squash

    postMessage2(sender: String, receiver: String, text: String): ID!

    uploadImage(
    image: FileUpload!
    ):Boolean

    updateUserProfile(
      _id: String!
      firstName: String!
      lastName: String!
      age: Int!
      gender: String!
      sports: [SquashNodeInput!]!
      neighborhood:LocationInput!
      description: String!
      addLocalImages: [FileUploadInput!]!,
      removeUploadedImages: [DataInput],
      originalImages: [DataInput!]!,
    ): Squash

    createSquash2(
      _id: String!
      firstName: String!
      lastName: String!
      age: Int!
      gender: String!
      sports: [SquashNodeInput!]!
      neighborhood: LocationInput!
      description: String!
      image_set: [FileUpload!]
      matches : [PotentialMatchInput!]
      blocked_me : [PotentialMatchInput!]
      i_blocked : [PotentialMatchInput!]
      likes : [String!]
      dislikes : [String!]
      likedByUSers: [String!]
      phoneNumber: String
      email: String
      newUserToken: String
      matchQueue: [MatchQueueInput!]
    ): Squash!

    createSquashTestSamples(
      _id: String!
      firstName: String!
      email: String!
      lastName: String!
      age: Int!
      gender: String!
      sports: [SquashNodeInput!]!
      neighborhood: LocationInput!
      description: String!
      image_set: [DataInput!]!
      matches : [PotentialMatchInput!]
      blocked_me : [PotentialMatchInput!]
      i_blocked : [PotentialMatchInput!]
      likes : [String!]
      dislikes : [String!]
      likedByUSers: [String!]
      phoneNumber: String
      matchQueue: [MatchQueueInput!]
    ): Squash!

    softDeleteUser(_id: String): String!
    softUnDeleteUser(_id: String): String!
  }
`;

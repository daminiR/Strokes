//import {gql} from 'apollo-server-express';
import { gql } from "apollo-server-lambda";
import {
  LocationType,
  MessageType,
  DeletedType,
  SquashNodeType,
  DataType,
  ImageData,
  ageRange,
  PotentialMatchUserType,
  LikedByUserType,
  LikedByUserInputType,
  userExistT,
  PotentialMatchUserInputType,
  SquashType,
  SquashInputType
} from '../types/UserDefs'
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

    updateLikes(_id: String!, likes: [String!], currentUserData: PotentialMatchInput!, isFromLikes: Boolean!): Squash
    updateDislikes(_id: String!, dislikes: [String!], isFromLikes: Boolean!): Squash
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
      newUserToken: String
    ): Squash!

    createSquashTestSamples(
      _id: String!
      first_name: String!
      email: String!
      last_name: String!
      age: Int!
      gender: String!
      sports: [SquashNodeInput!]!
      location: LocationInput!
      description: String!
      image_set: [DataInput!]!
      matches : [PotentialMatchInput!]
      blocked_me : [PotentialMatchInput!]
      i_blocked : [PotentialMatchInput!]
      likes : [String!]
      dislikes : [String!]
      likedByUSers: [String!]
      phoneNumber: String
    ): Squash!

    softDeleteUser(_id: String): String!
  }
`;

import { gql } from "apollo-server-lambda";
import {
  LocationType,
  RangeType,
  FilterInputType,
  DeletedType,
  SquashNodeType,
  DataType,
  ImageData,
  FilterType,
  MatchQueueType,
  FileUploadType,
  PotentialMatchUserType,
  LikedByUserType,
  LikedByUserInputType,
  PotentialMatchUserInputType,
  SquashType,
  SquashInputType,
} from '../../types/UserDefs'
//TODO: change inout ype for age to be Int! but after you configure the birthdate resolver
//TODO: need to add apollo server error handling
//TODO: ADD enum check for states and countt maybe

export const typeDefs = gql`
  type LocationType {
    ${LocationType}
  }
  input LocationInput {
    ${LocationType}
  }
  input AgeRangeInput {
    ${RangeType}
  }
  input GameLevelRangeInput {
    ${RangeType}
  }
  type AgeRangeType {
    ${RangeType}
  }
  type GameLevelRangeType {
    ${RangeType}
  }
  type DeletedType {
    ${DeletedType}
  }
  input DeletedInput {
    ${DeletedType}
  }
  input FileUploadInput {
    ${FileUploadType}
  }
  input LikedByUserInput {
    ${LikedByUserInputType}
  }
  type LikedByUser {
    ${LikedByUserType}
  }
  scalar FileUpload
  type Query {
    fetchProfileById(id: String!): Squash
    fetchAllProfiles(limit: Int): [Squash!]
    fetchFilteredMatchQueue(_id: String!, offset: Int, limit: Int, location: LocationInput!, sport: String!, gameLevelRange:[String!]!, ageRange: AgeRangeInput): [Squash!]
    fetchNonInteractedMatches(_id: String!, offset: Int, limit: Int, location: LocationInput!, sport: String!, gameLevelRange:[String!]!, ageRange: AgeRangeInput): [Squash!]
    retrieveSwipeLimits(_id: String!): Int!
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
  type MatchQueueType {
      ${MatchQueueType}
  }
  input FilterInput {
      ${FilterInputType}
  }
  type FilterType {
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
  type DataOutput {
    imageURL: String!
    filePath: String!
  }
  type Data{
    ${DataType}
  }

  type Mutation {
    updateAllUserSchema(_id: String!): String
    deleteImage(_id: String, img_idx: Int): [Data!]!
    recordLikesAndUpdateCount(_id: String!, likes: [String!], currentUserData: PotentialMatchInput!, isFromLikes: Boolean!): Squash
    recordDislikesAndUpdateCount(_id: String!, dislikes: [String!], isFromLikes: Boolean!): Squash
    updateMatches(currentUserId: String!, potentialMatchId: String!, currentUser: PotentialMatchInput, potentialMatch: PotentialMatchInput): Squash
    updateProfile(
      _id: String!
      firstName: String!
      lastName: String!
      age: Int!
      gender: String!
      sport: SquashNodeInput!
      neighborhood:LocationInput!
      description: String!
      addLocalImages: [FileUploadInput!]!,
      removeUploadedImages: [DataInput],
      originalImages: [DataInput!]!,
    ): Squash

    registerNewSquashPlayer(
      _id: String!
      firstName: String!
      lastName: String!
      age: Int!
      gender: String!
      sport: SquashNodeInput!
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
      preferences: FilterInput!
    ): Squash!

    registerNewSquashPlayerTest(
      _id: String!
      firstName: String!
      email: String!
      lastName: String!
      age: Int!
      gender: String!
      sport: SquashNodeInput!
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
      preferences: FilterInput!
    ): Squash!

    softDeletePlayer(_id: String): String!
    softUnDeletePlayer(_id: String): String!
  }
`;

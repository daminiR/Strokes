import { gql } from "apollo-server-lambda";
import {
  UserStatsType,
  LocationType,
  RangeType,
  ImageData,
  FilterInputType,
  DeletedType,
  SportNodeType,
  DataType,
  FilterType,
  MatchQueueType,
  FileUploadType,
  PotentialMatchUserType,
  LikedByUserType,
  LikedByUserInputType,
  PotentialMatchUserInputType,
  UserType,
  UserInputType,
} from '../../types/UserDefs'
//TODO: change inout ype for age to be Int! but after you configure the birthdate resolver
//TODO: need to add apollo server error handling
//TODO: ADD enum check for states and countt maybe

export const typeDefs = gql`
  type UserStats {
    ${UserStatsType}
  }
  type LocationType {
    ${LocationType}
  }
  type UserType {
    ${UserType}
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
  type Filter {
    ${FilterType}
  }
type DislikeRecord {
  createdAt: String
  updatedAt: String
  _id: String
}
  type FetchFilteredMatchQueueResult {
  potentialMatches: [PotentialMatch!]
  filtersHash: String
  filters: Filter
  dislikes: [DislikeRecord]
}

  scalar FileUpload
  type Query {
    fetchProfileById(id: String!): User
    fetchAllProfiles(limit: Int): [User!]
    fetchFilteredMatchQueue(_id: String!): FetchFilteredMatchQueueResult
    fetchNonInteractedMatches(_id: String!, offset: Int, limit: Int, location: LocationInput!, sport: String!, gameLevelRange:[String!]!, ageRange: AgeRangeInput): [User!]
    retrieveSwipeLimits(_id: String!): Int!
    getUserLimitsAndStats(id: String!): UserStats
  }
  input SportNodeInput {
    ${SportNodeType}
  }
  type SportNode {
    ${SportNodeType}
  }
  type User {
      ${UserType}
  }
  input UserInput {
      ${UserInputType}
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
  type PotentialMatch {
    matchUserId: ID!
    firstName: String
    imageSet: [Data!]
    age: Int
    neighborhood: LocationType
    gender: String
    sport: SportNode
    description: String
    createdAt: String
    updatedAt: String
    interacted: Boolean
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
input FilterTypeInput {
  age: AgeRangeInput
  gameLevel: GameLevelInput
}

input AgeRangeInput {
  min: Int
  max: Int
}

input GameLevelInput {
  min: Int
  max: Int
}
  type UpdateMatchQueueResponse {
  success: Boolean!
  message: String
  data: MatchQueueData
}
type MatchQueueData {
  potentialMatches: [PotentialMatch]
}
type DislikeRecord {
  createdAt: String
  updatedAt: String
  _id: String
}
  type Data{
    ${DataType}
  }

  type Mutation {
    updateMatchQueueInteracted(currentUserId: String!, matchUserId: String!, isLiked: Boolean!): UpdateMatchQueueResponse!
    updateAllUserSchema(_id: String!): String
    deleteImage(_id: String, img_idx: Int): [Data!]!
    recordLikesAndUpdateCount(_id: String!, likes: [String!], currentUserData: PotentialMatchInput!, isFromLikes: Boolean!): User
    recordDislikesAndUpdateCount(_id: String!, dislikes: [String!], isFromLikes: Boolean!): User
    applyFilters(
      _id: String!
      filtersHash: String!
      filters: FilterTypeInput!
    ) : FetchFilteredMatchQueueResult
    updateMatches(currentUserId: String!, potentialMatchId: String!, currentUser: PotentialMatchInput, potentialMatch: PotentialMatchInput): User
    updateProfile(
      _id: String!
      firstName: String!
      lastName: String!
      age: Int!
      gender: String!
      sport: SportNodeInput!
      neighborhood:LocationInput!
      description: String!
      addLocalImages: [FileUploadInput!]!,
      removeUploadedImages: [DataInput],
      originalImages: [DataInput!]!,
    ): User

    registerNewPlayer(
      _id: String!
      firstName: String!
      lastName: String!
      age: Int!
      gender: String!
      sport: SportNodeInput!
      description: String!
      imageSet: [FileUploadInput!]
      phoneNumber: String
      email: String
    ): User!

    registerNewPlayerTest(
      _id: String!
      firstName: String!
      email: String!
      lastName: String!
      age: Int!
      gender: String!
      sport: SportNodeInput!
      neighborhood: LocationInput!
      description: String!
      imageSet: [DataInput!]!
      matches : [PotentialMatchInput!]
      blocked_me : [PotentialMatchInput!]
      i_blocked : [PotentialMatchInput!]
      likes : [String!]
      dislikes : [String!]
      likedByUSers: [String!]
      phoneNumber: String
      matchQueue: [MatchQueueInput!]
      preferences: FilterInput!
    ): User!
    softDeletePlayer(_id: String): String!
    softUnDeletePlayer(_id: String): String!
  }
`;

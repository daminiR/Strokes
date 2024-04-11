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
export const potentialMatchPoolTypeDefs = gql`

  type PotentialMatchPool {
    userId: ID!
    potentialMatches: [PotentialMatch!]!
  }
  extend type Query {
    getPotentialMatchPool(userId: ID!): PotentialMatchPool
  }
  type ManageUserInteractionsResult {
    success: Boolean!
    message: String!
    likesRemovalResult: ActionOutcome!
    matchesRemovalResult: ActionOutcome!
    updateMatchesResult: ActionOutcome!
    randomLikesResult: RandomLikesOutcome!
  }

  type ActionOutcome {
    success: Boolean!
    message: String!
    count: Int
  }

  type RandomLikesOutcome {
    success: Boolean!
    message: String!
    likes: [LikeResult!]!
  }

  type LikeResult {
    likerId: ID!
    likedId: ID!
    success: Boolean!
  }
  type UpdateMatchesResult {
    success: Boolean!
    message: String!
    updatedCount: Int
    potentialMatches: [PotentialMatch!]
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

  extend type Mutation {
    updatePotentialMatchesTest(currentUserId: ID!): UpdateMatchesResult!
    manageUserInteractions(currentUserId: ID!): ManageUserInteractionsResult!
    updatePotentialMatchPool(
      userId: ID!
      matches: [ID!]!
    ): PotentialMatchPoolResponse
    interactWithPotentialMatch(
      userId: ID!
      matchUserId: ID!
      interacted: Boolean!
    ): PotentialMatchResponse
  }
  type PotentialMatchPoolResponse {
    success: Boolean!
    message: String
    potentialMatchPool: PotentialMatchPool
  }

  type PotentialMatchResponse {
    success: Boolean!
    message: String
    potentialMatch: PotentialMatch
  }
`;

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

export const likesTypeDefs = gql`
  extend type Query {
    #Fetch users who liked the current user
    fetchLikesReceived(userId: String!): [User!]
    #Fetch users liked by the current user
    fetchLikesGiven(userId: String!): [User!]
    fetchLikedIds(userId: ID!, page: Int!, limit: Int!): [LikedProfile!]
  }

  type LikedProfile {
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
    isBlurred: Boolean
  }

  extend type Mutation {
    #Record a like action from one user to another
    recordLike(likerId: String!, likedId: String!): LikeResponse
    #Optional: Unlike a user
    removeLike(likerId: String!, likedId: String!): LikeResponse
  }
  #Represents the outcome of a like action
  type LikeResponse {
    success: Boolean!
    message: String
    matchFound: Boolean! # Indicates if a match was found as a result of the like
  }

  #For extending the User type with likes related information
  extend type User {
    likesReceived: [User!]
    likesGiven: [User!]
  }
`;

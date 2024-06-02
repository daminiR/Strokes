import { gql } from "apollo-server-lambda";
export const matchesTypeDefs = gql`
  type MutualLikeResult {
    isMutual: Boolean!
  }
  type Match {
    _id: ID!
    user1Id: String!
    user2Id: String!
    createdAt: String
  }
  type ChatData {
    channelUrl: String
    channelType: String
    channelStatus: String
    lastMessagePreview: String
    lastMessageTimestamp: String
    unreadMessageCount: Int
    channelCreationDate: String
    channelExpiryDate: String
    readReceiptsStatus: Boolean
    reportedBy: String
    blockedBy: String
  }

  type MatchedUsers {
    matchId: String!
    _id: String!
    firstName: String
    imageSet: [Data!]
    age: Int
    neighborhood: LocationType
    gender: String
    sport: SportNode
    description: String
    createdAt: String
    chat: ChatData
  }
  extend type Query {
    fetchMatchesForUser(
      userId: String!
      page: Int!
      limit: Int!
    ): [MatchedUsers!]!
    fetchMatchById(matchId: ID!): Match
    checkForMutualLike(
      currentUserId: String!
      likedId: String!
    ): MutualLikeResult!
  }

  extend type Mutation {
    createMatch(user1Id: String!, user2Id: String!): RemoveMatchResponse
    removeMatch(matchId: ID!): RemoveMatchResponse
  }
  type RemoveMatchResponse {
    success: Boolean!
    message: String!
    channelUrl: String
    channelStatus: String
  }

  type MatchResponse {
    success: Boolean!
    message: String
    match: Match
  }
`;

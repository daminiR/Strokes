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

  extend type Query {
    fetchMatchesForUser(userId: String!): [Match!]!
    fetchMatchById(matchId: ID!): Match
    checkForMutualLike(
      currentUserId: String!
      likedId: String!
    ): MutualLikeResult!
  }

  extend type Mutation {
    createMatch(user1Id: String!, user2Id: String!): MatchResponse
    removeMatch(matchId: ID!): MatchResponse
  }

  type MatchResponse {
    success: Boolean!
    message: String
    match: Match
  }
`;

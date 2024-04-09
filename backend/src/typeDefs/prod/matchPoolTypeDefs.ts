import { gql } from "apollo-server-lambda";
export const potentialMatchPoolTypeDefs = gql`
  type PotentialMatch {
    _id: ID!
    matchUserId: ID!
    createdAt: String!
    updatedAt: String!
    interacted: Boolean!
  }
  type PotentialMatchPool {
    userId: ID!
    potentialMatches: [PotentialMatch!]!
  }
  extend type Query {
    getPotentialMatchPool(userId: ID!): PotentialMatchPool
  }
  extend type Mutation {
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

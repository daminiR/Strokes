import { gql } from "apollo-server-lambda";

export const typeDefsTest = gql`
  type RemoveLikesResult {
    removedAsLikerCount: Int!
    removedAsLikedCount: Int!
    success: Boolean!
    message: String!
  }
  type LikeActionResult {
    likerId: String!
    likedId: String!
    success: Boolean!
  }
  type RemoveMatchesResult {
    removedMatchesCount: Int!
    success: Boolean!
    message: String!
  }
  type Mutation {
    removeAllMatchesForUserTest(userId: String!): RemoveMatchesResult!
    updateAllSportFieldsTest: User
    updatePlayerPreferencesTest(_id: String!): User
    simulateRandomLikesTest(currentUserId: String!): [LikeActionResult!]!
    removeAllLikesForUserTest(userId: String!): RemoveLikesResult!
  }
`;

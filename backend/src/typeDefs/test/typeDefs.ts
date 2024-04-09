import { gql } from "apollo-server-lambda";

export const typeDefsTest = gql`
type LikeActionResult {
  likerId: String!
  likedId: String!
  success: Boolean!
}
  type Mutation {
    updateAllSportFieldsTest: User
    updatePlayerPreferencesTest(_id: String!): User
    simulateRandomLikes(currentUserId: String!): [LikeActionResult!]!
  }
`;

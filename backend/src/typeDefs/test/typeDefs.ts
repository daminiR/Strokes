import {gql} from "apollo-server-lambda";

export const typeDefsTest = gql`
type UnhideChannelResult {
    success: Boolean!
    message: String!
    channelUrl: String
  }

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
  type UpdateUsersResult {
    success: Boolean!
    message: String!
  }
  type RemoveDislikesResponse {
    success: Boolean!
    message: String!
  }
  type Mutation {
    removeAllMatchesForUserTest(userId: String!): RemoveMatchesResult!
    unhideSendbirdChannel(channelUrl: String!): UnhideChannelResult!
    updateAllSportFieldsTest: User
    updatePlayerPreferencesTest: UpdateUsersResult
    simulateRandomLikesFromUsersTest(
      currentUserId: String!
      randomize: Boolean
    ): [LikeActionResult!]!
    simulateRandomLikesTest(
      currentUserId: String!
      randomize: Boolean
    ): [LikeActionResult!]!
    removeAllDislikesTest(userId: String!): RemoveDislikesResponse!
    removeAllLikesForUserTest(userId: String!): RemoveLikesResult!
    removeAllLikesByUser(userId: String!) : RemoveLikesResult!
    addSpecificLike(currentUserId: String!, likerId: String!): LikeActionResult!
  }
`;

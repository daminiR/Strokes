import { gql } from 'urql';

export const FETCH_MATCHES_FOR_USER_QUERY = gql`
  query FetchMatchesForUser($userId: String!) {
    fetchMatchesForUser(userId: $userId) {
      _id
      user1Id
      user2Id
      createdAt
    }
  }
`;
export const FETCH_MATCH_BY_ID_QUERY = gql`
  query FetchMatchById($matchId: ID!) {
    fetchMatchById(matchId: $matchId) {
      _id
      user1Id
      user2Id
      createdAt
    }
  }
`;

export const CHECK_FOR_MUTUAL_LIKE_QUERY = gql`
  query CheckForMutualLike($currentUserId: String!, $likedId: String!) {
    checkForMutualLike(currentUserId: $currentUserId, likedId: $likedId) {
      isMutual
    }
  }
`;

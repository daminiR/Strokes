import { gql } from 'urql';

export const UPDATE_MATCH_QUEUE_INTERACTED_MUTATION = gql`
  mutation UpdateMatchQueueInteracted($currentUserId: String!, $likedId: String!, $interacted: Boolean!) {
    updateMatchQueueInteracted(currentUserId: $currentUserId, likedId: $likedId, interacted: $interacted) {
      success
      message
      data {
        potentialMatches
      }
    }
  }
`;
export const CREATE_MATCH_MUTATION = gql`
  mutation CreateMatch($user1Id: String!, $user2Id: String!) {
    createMatch(user1Id: $user1Id, user2Id: $user2Id) {
      success
      message
      match {
        _id
        user1Id
        user2Id
        createdAt
      }
    }
  }
`;
export const REMOVE_MATCH_MUTATION = gql`
  mutation RemoveMatch($matchId: ID!) {
    removeMatch(matchId: $matchId) {
      success
      message
    }
  }
`;

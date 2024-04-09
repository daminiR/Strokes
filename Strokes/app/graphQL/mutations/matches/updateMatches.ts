import { gql } from 'urql';

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

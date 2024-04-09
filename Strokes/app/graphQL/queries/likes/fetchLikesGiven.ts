import { gql } from 'urql';

export const FETCH_LIKES_RECEIVED_QUERY = gql`
  query FetchLikesReceived($userId: String!) {
    fetchLikesReceived(userId: $userId) {
      _id
      firstName
      lastName
    }
  }
`;

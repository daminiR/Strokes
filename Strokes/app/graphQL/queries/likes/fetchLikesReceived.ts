import { gql } from 'urql';

export const FETCH_LIKES_GIVEN_QUERY = gql`
  query FetchLikesGiven($userId: String!) {
    fetchLikesGiven(userId: $userId) {
      _id
      firstName
      lastName
    }
  }
`;


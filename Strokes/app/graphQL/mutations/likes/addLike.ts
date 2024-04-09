import { gql } from 'urql';

export const ADD_LIKE_MUTATION = gql`
  mutation RecordLike($likerId: String!, $likedId: String!) {
    recordLike(likerId: $likerId, likedId: $likedId) {
      success
      message
      matchFound
    }
  }
`;

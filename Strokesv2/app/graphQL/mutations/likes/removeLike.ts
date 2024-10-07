import { gql } from 'urql';

export const REMOVE_LIKE_MUTATION = gql`
  mutation RemoveLike($likerId: String!, $likedId: String!) {
    removeLike(likerId: $likerId, likedId: $likedId) {
      success
      message
    }
  }
`;

import {gql} from '@apollo/client';

export const FETCH_LIKES_GIVEN_QUERY = gql`
  query FetchLikesGiven($userId: String!) {
    fetchLikesGiven(userId: $userId) {
      _id
      firstName
      lastName
    }
  }
`;

export const GET_LIKED_USER_PROFILES = gql`
  query GetLikedUserProfiles($userId: ID!, $page: Int!, $limit: Int!) {
    fetchLikedIds(userId: $userId, page: $page, limit: $limit) {
      matchUserId
      firstName
      imageSet {
        img_idx
        imageURL
      }
      age
      neighborhood {
        city
        state
        country
      }
      gender
      sport {
        sportName
        gameLevel
      }
      description
      createdAt
      updatedAt
      interacted
      isBlurred
    }
  }
`


import { gql } from 'urql';

export const FETCH_MATCHES_FOR_USER_QUERY = gql`
  query FetchMatchesForUser($userId: String!, $page: Int!, $limit: Int!) {
    fetchMatchesForUser(userId: $userId, page: $page, limit: $limit) {
      _id
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
      chat {
        channelUrl
        channelType
        channelStatus
        lastMessagePreview
        lastMessageTimestamp
        unreadMessageCount
        channelCreationDate
        channelExpiryDate
        readReceiptsStatus
        reportedBy
        blockedBy
      }
    }
  }
`

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

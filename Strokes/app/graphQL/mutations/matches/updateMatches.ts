import {gql} from '@apollo/client';


export const UPDATE_MATCH_QUEUE_INTERACTED_MUTATION = gql`
  mutation UpdateMatchQueueInteracted(
    $currentUserId: String!
    $matchUserId: String!
    $isLiked: Boolean!
  ) {
    updateMatchQueueInteracted(
      currentUserId: $currentUserId
      matchUserId: $matchUserId
      isLiked: $isLiked
    ) {
      success
      message
      data {
        potentialMatches {
          interacted
          createdAt
          updatedAt
          neighborhood {
            city
            state
            country
          }
          matchUserId
          firstName
          age
          gender
          sport {
            sportName
            gameLevel
          }
          description
          imageSet {
            img_idx
            imageURL
          }
        }
      }
    }
  }
`
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
  mutation RemoveMatch($matchId: ID!, $reason: String!, $userId: ID!) {
    removeMatch(matchId: $matchId, reason: $reason, userId: $userId) {
      success
      message
      channelUrl
      channelStatus
    }
  }
`

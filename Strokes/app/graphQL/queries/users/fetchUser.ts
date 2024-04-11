import { gql, useMutation } from 'urql';

const READ_SQUASHES = gql`
  query FetchAllProfiles($limit: Int){
    fetchAllProfiles(limit: $limit){
      _id
      type
    }
  }
`

const SWIPED_LEFT = gql`
  query RetrieveSwipeLimits($phoneNumber: String!){
    retrieveSwipeLimits(_id: Number)
  }
`

const GET_POTENTIAL_MATCHES = gql`
  query fetchFilteredMatchQueue($_id: String!) {
    fetchFilteredMatchQueue(_id: $_id) {
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
        image_set {
          img_idx
          imageURL
        }
      }
    }
  }
`

const READ_SQUASH = gql`
  query FetchProfileById($id: String!) {
    fetchProfileById(id: $id) {
      _id
      firstName
      lastName
      age
      gender
      deleted {
        isDeleted
        deletedAt
      }
      sport {
        sportName
        gameLevel
      }
      neighborhood {
        city
        state
        country
      }
      visableLikePerDay
      description
      phoneNumber
      email
      image_set {
        img_idx
        imageURL
        filePath
      }
      lastFetchedFromTrigger
      dislikes
    }
  }
`

export {
  GET_POTENTIAL_MATCHES,
  READ_SQUASH,
  READ_SQUASHES,
  SWIPED_LEFT,
};

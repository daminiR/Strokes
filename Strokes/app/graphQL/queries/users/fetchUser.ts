import {gql} from '@apollo/client';

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
      filters {
        age {
          min
          max
        }
        gameLevel {
          min
          max
        }
      }
      filtersHash
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
`

const READ_SQUASH = gql`
  query FetchProfileById($id: String!) {
    fetchProfileById(id: $id) {
      _id
      firstName
      lastName
      age
      gender
      accessToken
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
      description
      phoneNumber
      email
      imageSet {
        img_idx
        imageURL
        filePath
      }
    }
  }
`

export {
  GET_POTENTIAL_MATCHES,
  READ_SQUASH,
  READ_SQUASHES,
  SWIPED_LEFT,
};

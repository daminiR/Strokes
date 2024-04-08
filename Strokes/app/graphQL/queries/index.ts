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
        neighborhood {
          city
          state
          country
        }
        _id
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
      lastFetched
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
      swipesPerDay
      visableLikePerDay
      sportChangesPerDay
      description
      phoneNumber
      email
      image_set {
        img_idx
        imageURL
        filePath
      }
      lastFetched
      likes
      dislikes
      likedByUSers {
        _id
        firstName
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
        image_set {
          img_idx
          imageURL
          filePath
        }
      }
      matches {
        _id
        firstName
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
        image_set {
          img_idx
          imageURL
          filePath
        }
      }
    }
  }
`;

export {
  GET_POTENTIAL_MATCHES,
  READ_SQUASH,
  READ_SQUASHES,
  SWIPED_LEFT,
};

//import { gql, useMutation } from '@apollo/client'
import { gql, useMutation } from 'urql';

const APPLY_FILTERS = gql`
  mutation ApplyFilters($_id: String!, $preferencesHash: String!, $preferences: FilterInput!) {
    applyFilters(_id: $_id, preferencesHash: $preferencesHash, preferences: $preferences)
  }
`
const ADD_PROFILE2 = gql`
  mutation RegisterNewPlayer(
    $_id: String!
    $first_name: String!
    $last_name: String!
    $gender: String!
    $image_set: [FileUploadInput!]!
    $sport: SquashNodeInput!
    $age: Int!
    $description: String!
    $location: LocationInput!
    $phoneNumber: String
    $email: String
    $newUserToken: String
  ) {
    registerNewPlayer(
      _id: $_id
      first_name: $first_name
      gender: $gender
      age: $age
      sport: $sport
      location: $location
      last_name: $last_name
      image_set: $image_set
      description: $description
      phoneNumber: $phoneNumber
      email: $email
      newUserToken: $newUserToken
    ) {
      email
    }
  }
`;
const UPDATE_USER_PROFILE = gql`
  mutation UpdateProfile(
    $_id: String!
    $firstName: String!
    $lastName: String!
    $gender: String!
    $add_local_images: [FileUploadInput!]!
    $remove_uploaded_images: [DataInput]
    $original_uploaded_image_set: [DataInput!]!
    $sport: SquashNodeInput!
    $neighborhood: LocationInput!
    $age: Int!
    $description: String!
  ) {
    updateProfile(
      _id: $_id
      firstName: $firstName
      gender: $gender
      age: $age
      sport: $sport
      neighborhood: $neighborhood
      lastName: $lastName
      addLocalImages: $add_local_images
      removeUploadedImages: $remove_uploaded_images
      originalImages: $original_uploaded_image_set
      description: $description
    ) {
      _id
      firstName
      lastName
      neighborhood {
        city
        state
        country
      }
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
        filePath
      }
    }
  }
`;


const UPDATE_DISLIKES = gql`
  mutation RecordDislikesAndUpdateCount($_id: String!, $dislikes: [String!]!, $isFromLikes: Boolean!) {
    recordDislikesAndUpdateCount(_id: $_id, dislikes: $dislikes, isFromLikes: $isFromLikes)
    {
      _id
      first_name
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
        filePath
      }
    }
  }
`;

const UPDATE_MATCHES = gql`
  mutation UpdateMatches(
    $currentUserId: String!
    $potentialMatchId: String!
    $currentUser: PotentialMatchInput
    $potentialMatch: PotentialMatchInput
  ) {
    updateMatches(
      currentUserId: $currentUserId
      potentialMatchId: $potentialMatchId
      currentUser: $currentUser
      potentialMatch: $potentialMatch
    ) {
      _id
      first_name
      last_name
      age
      gender
      sport {
        sportName
        gameLevel
      }
      location {
        city
        state
        country
      }
      description
      image_set {
        img_idx
        imageURL
        filePath
      }
      likes
      dislikes
      matches {
      location {
        city
        state
        country
      }
        _id
        first_name
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
          filePath
        }
      }
    }
  }
`;

const UPDATE_LIKES = gql`
  mutation RecordLikesAndUpdateCount($_id: String!, $likes: [String!]!, $currentUserData: PotentialMatchInput!, $isFromLikes: Boolean!) {
    recordLikesAndUpdateCount(_id: $_id, likes: $likes, currentUserData: $currentUserData, isFromLikes: $isFromLikes){
      _id
      first_name
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
        filePath
      }
    }
  }
`;
const SOFT_DELETE_PROFILE = gql`
  mutation softDeletePlayer($_id: String!) {
    softDeleteUser(_id: $_id)
  }
`
const SOFT_UN_DELETE_PROFILE = gql`
  mutation SoftUnDeletePlayer($_id: String!) {
    softUnDeletePlayer(_id: $_id)
  }
`
export {
  UPDATE_USER_PROFILE,
  ADD_PROFILE2,
  UPDATE_DISLIKES,
  UPDATE_LIKES,
  UPDATE_MATCHES,
  SOFT_DELETE_PROFILE,
  SOFT_UN_DELETE_PROFILE,
  APPLY_FILTERS,
};

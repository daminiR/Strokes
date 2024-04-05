//import { gql} from '@apollo/client'
import { gql, useMutation } from 'urql';

// something wrong with the way this is written
const READ_SQUASHES = gql`
  query Squashes ($limit: Int){
    squashes (limit: $limit){
      _id
      type
    }
  }
`
const CHECK_PHONE_INPUT = gql`
  query  CheckPhoneInput($phoneNumber: String!){
    checkPhoneInput (phoneNumber: $phoneNumber){
      isPhoneExist,
      isDeleted
    }
  }
`
const SWIPED_LEFT = gql`
  query  GetSwipesPerDay($phoneNumber: String!){
    getSwipesPerDay (_id: Number)
  }
`
const GET_MESSAGES = gql`
  query  Messages($currentUserID: String!, $matchedUserID: String!, $offset: Int!, $limit: Int!){
    messages (currentUserID: $currentUserID, matchedUserID: $matchedUserID, offset: $offset, limit: $limit){
      _id,
      sender,
      receiver,
      text,
    }
  }
`
const MESSAGE_POSTED = gql`
 subscription MessagePosted {
  messagePosted {
    _id
    sender
	receiver
    text
  }
}`

const GET_POTENTIAL_MATCHES = gql`
  query QueryProssibleMatches(
    $_id: String!
    $offset: Int
    $limit: Int
    $neighborhood: LocationInput!
    $gamelLevelRange: GameLevelRange
    $ageRange: AgeRangeInput
  ) {
    queryProssibleMatches(
      _id: $_id
      offset: $offset
      limit: $limit
      neighborhood: $neighborhood
      gamelLevelRange: $gamelLevelRange
      sport: $sport
      ageRange: $ageRange
    ) {
      neighborhood
        city
        state
        country
      }
      _id
      firstName
      age
      gender
      sport {
        sport
      gameLevel
      }
      description
      image_set {
        img_idx
        imageURL
      }
    }
  }
`
const READ_URL = gql`
  query Display ($filename: String!){
    display(filename: $filename){
      _id
    }
  }
`
const READ_SQUASH = gql`
  query Squash($id: String!) {
    squash(id: $id) {
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
        sport
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
          sport
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
          sport
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
const GET_SELECTED_SQUASH = gql`
      query @client {
          _id
      }
`;
const GET_SELECTED_SQUASH_1 = gql`
    query  GetSqushItems {
      squashId @client
    }
`;

const GET_SPORTS_LIST = gql`
    query  GetSportsList {
      sportItems @client
      {
          sport
          gameLevel
      }
    }
`;
const GET_FIRST_NAME = gql`
    query  GetFirstName {
      fullName @client
    }
`;
const GET_INPUT_TYPE = gql`
    query  getInputType {
      inputItems @client
    }
`;
const GET_ACCOUNT_INPUT_TYPE = gql`
    query  getInputType {
      inputAccountItems @client
    }
`;
const GET_ACCOUNT_DETAIL_INPUT_TYPE = gql`
    query  getInputType {
      inputAccountDetailItems @client
    }
`;
const GET_DESCRIPTION = gql`
    query  GetDescription {
      description @client
    }
`;
const GET_AGE = gql`
    query  GetAge {
      age @client
    }
`;
const GET_GENDER = gql`
    query  GetGender {
      gender @client
    }
`;
const GET_PROFILE_STATUS = gql`
  query getProfileStatus {
    isProfileComplete @client
  }
`;
export {
  CHECK_PHONE_INPUT,
  GET_ACCOUNT_DETAIL_INPUT_TYPE,
  GET_ACCOUNT_INPUT_TYPE,
  MESSAGE_POSTED,
  GET_MESSAGES,
  GET_INPUT_TYPE,
  GET_POTENTIAL_MATCHES,
  GET_DESCRIPTION,
  GET_AGE,
  GET_GENDER,
  GET_FIRST_NAME,
  GET_SPORTS_LIST,
  READ_URL,
  GET_PROFILE_STATUS,
  READ_SQUASH,
  READ_SQUASHES,
  GET_SELECTED_SQUASH,
  GET_SELECTED_SQUASH_1,
  SWIPED_LEFT,
};

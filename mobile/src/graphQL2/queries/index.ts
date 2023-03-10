import { gql} from '@apollo/client'

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
  query QueryProssibleMatches ($_id: String!, $offset: Int, $limit: Int, $location: LocationInput!, $sport: String!, $game_levels: [String!]!, $ageRange: AgeRangeInput){
    queryProssibleMatches (_id: $_id offset: $offset, limit:$limit, location: $location, game_levels:$game_levels, sport: $sport, ageRange: $ageRange){
      location {
        city
        state
        country
      }
      _id
      first_name
      age
      gender
      sports {
        sport
        game_level
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
      first_name
      last_name
      age
      gender
      deleted {
        isDeleted
        deletedAt
      }
      sports {
        sport
        game_level
      }
      location {
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
        first_name
        age
        location {
          city
          state
          country
        }
        gender
        sports {
          sport
          game_level
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
        first_name
        age
        location {
          city
          state
          country
        }
        gender
        sports {
          sport
          game_level
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
          game_level
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


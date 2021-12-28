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

const GET_MESSAGES = gql`
  query  Messages($currentUserID: String!, $matchedUserID: String!){
    messages (currentUserID: $currentUserID, matchedUserID: $matchedUserID){
      _id,
      sender,
      receiver,
      text,
      createdtAt
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
  query QueryProssibleMatches ($_id: String!){
    queryProssibleMatches (_id: $_id ){
      location {
        city
        state
        country
      }
      _id
      first_name
      last_name
      age
      gender
      sports {
        sport
        game_level
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
      }
      likes
      {
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
        filePath
      }
      }
      dislikes
      {
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
        filePath
      }
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
      sports {
        sport
        game_level
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
      {
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
        filePath
      }
      }
      dislikes
      {
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
        filePath
      }
      }
      likedByUSers
      {
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
        filePath
      }
      }
      matches
      {
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
    query  getProfileStatus {
      isProfileComplete @client
    }
`;
export { GET_ACCOUNT_DETAIL_INPUT_TYPE, GET_ACCOUNT_INPUT_TYPE, MESSAGE_POSTED, GET_MESSAGES, GET_INPUT_TYPE, GET_POTENTIAL_MATCHES, GET_DESCRIPTION, GET_AGE, GET_GENDER, GET_FIRST_NAME, GET_SPORTS_LIST, READ_URL,GET_PROFILE_STATUS, READ_SQUASH, READ_SQUASHES, GET_SELECTED_SQUASH, GET_SELECTED_SQUASH_1}

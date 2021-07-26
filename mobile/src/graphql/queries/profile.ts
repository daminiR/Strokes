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
const READ_URL = gql`
  query Display ($filename: String!){
    display(filename: $filename){
      _id
    }
  }
`
const READ_SQUASH = gql`
  query squash ($id: id!){
    squash(_id: $id){
      _id
      first_name
    }
  }
`
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

const GET_PROFILE_STATUS = gql`
    query  getProfileStatus {
      isProfileComplete @client
    }
`;
export { READ_URL,GET_PROFILE_STATUS, READ_SQUASH, READ_SQUASHES, GET_SELECTED_SQUASH, GET_SELECTED_SQUASH_1}

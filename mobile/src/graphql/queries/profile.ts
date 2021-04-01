import { gql} from '@apollo/client'

const READ_SQUASHES = gql`
  query squashes {
    squashes {
      _id
      type
    }
  }
`
const READ_SQUASH = gql`
  query Squash ($id: ID!){
    squash(id: $id){
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
export {GET_PROFILE_STATUS, READ_SQUASH, READ_SQUASHES, GET_SELECTED_SQUASH, GET_SELECTED_SQUASH_1}

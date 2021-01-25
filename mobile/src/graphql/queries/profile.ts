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
export {READ_SQUASH, READ_SQUASHES, GET_SELECTED_SQUASH, GET_SELECTED_SQUASH_1}

import { gql, useMutation } from '@apollo/client'

const ADD_PROFILE = gql`
  mutation CreateSquash($first_name: String!){
    createSquash(first_name: $first_name){
      first_name
    }
  }
`
export { ADD_PROFILE }

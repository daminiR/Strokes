import { gql, useMutation } from '@apollo/client'

const ADD_PROFILE = gql`
  mutation CreateSquash($first_name: String!, $gender: String!, $game_level: String, $image_set: String!, $sports: String, $age: String){
    createSquash(first_name: $first_name){
      first_name
    }
  }
`
export { ADD_PROFILE }

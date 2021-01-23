import { gql, useMutation } from '@apollo/client'

const ADD_PROFILE = gql`
  mutation CreateSquash($first_name: String!, $gender: String!, $game_level: String!, $image_set: [String!]!, $sports: [SquashNode!]! , $birthday:String!){
    createSquash(first_name: $first_name, gender: $gender, age: $birthday, sports: $sports, image_set: $image_set, game_level: $game_level){
      first_name
    }
  }
`
export { ADD_PROFILE }

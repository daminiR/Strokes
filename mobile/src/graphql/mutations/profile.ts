import { gql, useMutation } from '@apollo/client'

const UPLOAD_FILE = gql`
  mutation UploadFile($file: Upload!){
        uploadFile(file: $file)
    }
`
const ADD_PROFILE = gql`
  mutation CreateSquash($_id: String!, $first_name: String!, $gender: String!, $game_level: String!, $image_set: [String!]!, $sports: [SquashNode!]! , $birthday:String!){
    createSquash(_id: $_id, first_name: $first_name, gender: $gender, age: $birthday, sports: $sports, image_set: $image_set, game_level: $game_level){
      _id
    }
  }
`
const DELETE_PROFILE = gql`
  mutation DeleteSquash($id: ID!) {
    deleteSquash(id: $id)
  }
`
export { UPLOAD_FILE, ADD_PROFILE , DELETE_PROFILE}

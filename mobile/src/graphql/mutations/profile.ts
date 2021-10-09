import { gql, useMutation } from '@apollo/client'

//mutation UploadFile($files: [Upload!]!, $_id: String!){
const DELETE_IMAGE = gql`
  mutation DeleteImage($_id: String, $img_idx: Int){
        deleteImage(_id: $_id, img_idx: $img_idx){
          img_idx
        }
    }
`
const UPLOAD_FILE = gql`
  mutation UploadFile($file: Upload!, $_id: String, $img_idx: Int){
        uploadFile(file: $file, _id: $_id, img_idx: $img_idx){
          imageURL
        }
    }
`
const ADD_PROFILE2 = gql`
  mutation CreateSquash2($_id: String!, $image_set: [ImageData!]!){
    createSquash2(_id: $_id, image_set: $image_set)
  }
`
const ADD_PROFILE = gql`
  mutation CreateSquash($_id: String!, $first_name: String!, $last_name: String!, $gender: String!, $image_set: [DataInput]!, $sports: [SquashNodeInput!]! , $age:Int!){
    createSquash(_id: $_id, first_name: $first_name, gender: $gender, age: $age, sports: $sports, last_name: $last_name, image_set: $image_set){
      _id
    }
  }
`
const UPDATE_USER_SPORTS = gql`
  mutation UpdateUserSports($_id: String!, $sportsList: [SquashNodeInput!]!){
    updateUserSports(_id: $_id, sportsList: $sportsList)
  }
`
const UPDATE_NAME = gql`
  mutation UpdateName($_id: String!, $first_name: String!, $last_name: String!){
    updateName(_id: $_id, first_name: $first_name, last_name: $last_name)
  }
`
const UPDATE_AGE = gql`
  mutation UpdateAge($_id: String!,$age: Int! ){
    updateAge(_id: $_id, age: $age)
  }
`
const UPDATE_GENDER = gql`
  mutation UpdateGender($_id: String!,$gender: String! ){
    updateGender(_id: $_id, gender: $gender)
  }
`
const DELETE_PROFILE = gql`
  mutation DeleteSquash($id: ID!) {
    deleteSquash(id: $id)
  }
`
const UPDATE_PROFILE_COMPLETE = gql`
  mutation UpdateProfileComplete($id: ID, $isProfileComplete: Boolean!){
      _id
      isProfileComplete
    }
`;
const UPDATE_DESCRIPTION = gql`
  mutation UpdateDescription($_id: String!,$description: String! ){
    updateDescription(_id: $_id, description: $description)
  }
`
export {ADD_PROFILE2, UPDATE_DESCRIPTION, UPDATE_USER_SPORTS,  UPDATE_GENDER, UPDATE_AGE, UPDATE_NAME, DELETE_IMAGE, UPLOAD_FILE, ADD_PROFILE , DELETE_PROFILE}

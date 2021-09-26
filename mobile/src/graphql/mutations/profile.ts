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
const ADD_PROFILE = gql`
  mutation CreateSquash($_id: String!, $first_name: String!, $gender: String!, $image_set: [DataInput]!, $sports: [SquashNodeInput!]! , $birthday:String!){
    createSquash(_id: $_id, first_name: $first_name, gender: $gender, age: $birthday, sports: $sports, image_set: $image_set){
      _id
    }
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
export { DELETE_IMAGE, UPLOAD_FILE, ADD_PROFILE , DELETE_PROFILE}

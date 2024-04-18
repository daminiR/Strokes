import { gql } from 'urql';

const ADD_PROFILE2 = gql`
  mutation RegisterNewPlayer(
    $_id: String!
    $first_name: String!
    $last_name: String!
    $gender: String!
    $imageSet: [FileUploadInput!]!
    $sport: SquashNodeInput!
    $age: Int!
    $description: String!
    $location: LocationInput!
    $phoneNumber: String
    $email: String
    $newUserToken: String
  ) {
    registerNewPlayer(
      _id: $_id
      first_name: $first_name
      gender: $gender
      age: $age
      sport: $sport
      location: $location
      last_name: $last_name
      imageSet: $imageSet
      description: $description
      phoneNumber: $phoneNumber
      email: $email
      newUserToken: $newUserToken
    ) {
      email
    }
  }
`;
export {
  ADD_PROFILE2,
};

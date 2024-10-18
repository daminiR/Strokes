import {gql} from '@apollo/client';

const ADD_PROFILE2 = gql`
  mutation RegisterNewPlayer(
    $_id: String!
    $firstName: String!
    $lastName: String!
    $gender: String!
    $imageSet: [FileUploadInput!]!
    $sport: SportNodeInput!
    $age: Int!
    $description: String!
    $phoneNumber: String
    $email: String
  ) {
    registerNewPlayer(
      _id: $_id
      firstName: $firstName
      gender: $gender
      age: $age
      sport: $sport
      lastName: $lastName
      imageSet: $imageSet
      description: $description
      phoneNumber: $phoneNumber
      email: $email
    ) {
      email
    }
  }
`;
export {
  ADD_PROFILE2,
};

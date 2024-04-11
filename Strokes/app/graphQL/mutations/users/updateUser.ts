import { gql } from 'urql';

const APPLY_FILTERS = gql`
  mutation ApplyFilters($_id: String!, $preferencesHash: String!, $preferences: FilterInput!) {
    applyFilters(_id: $_id, preferencesHash: $preferencesHash, preferences: $preferences) {
      _id
    }
  }
`
const UPDATE_USER_PROFILE = gql`
  mutation UpdateProfile(
    $_id: String!
    $firstName: String!
    $lastName: String!
    $gender: String!
    $add_local_images: [FileUploadInput!]!
    $remove_uploaded_images: [DataInput]
    $original_uploaded_image_set: [DataInput!]!
    $sport: SquashNodeInput!
    $neighborhood: LocationInput!
    $age: Int!
    $description: String!
  ) {
    updateProfile(
      _id: $_id
      firstName: $firstName
      gender: $gender
      age: $age
      sport: $sport
      neighborhood: $neighborhood
      lastName: $lastName
      addLocalImages: $add_local_images
      removeUploadedImages: $remove_uploaded_images
      originalImages: $original_uploaded_image_set
      description: $description
    ) {
      _id
      firstName
      lastName
      neighborhood {
        city
        state
        country
      }
      age
      gender
      sport {
        sportName
        gameLevel
      }
      description
      image_set {
        img_idx
        imageURL
        filePath
      }
    }
  }
`;


const UPDATE_DISLIKES = gql`
  mutation RecordDislikesAndUpdateCount($_id: String!, $dislikes: [String!]!, $isFromLikes: Boolean!) {
    recordDislikesAndUpdateCount(_id: $_id, dislikes: $dislikes, isFromLikes: $isFromLikes)
    {
      _id
      first_name
      age
      gender
      sport {
        sportName
        gameLevel
      }
      description
      image_set {
        img_idx
        imageURL
        filePath
      }
    }
  }
`;
export {
  UPDATE_USER_PROFILE,
  UPDATE_DISLIKES,
  APPLY_FILTERS,
};

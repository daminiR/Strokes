import {gql} from '@apollo/client';

const SOFT_DELETE_PROFILE = gql`
  mutation softDeletePlayer($_id: String!) {
    softDeleteUser(_id: $_id)
  }
`
const SOFT_UN_DELETE_PROFILE = gql`
  mutation SoftUnDeletePlayer($_id: String!) {
    softUnDeletePlayer(_id: $_id)
  }
`
export {
  SOFT_DELETE_PROFILE,
  SOFT_UN_DELETE_PROFILE,
};

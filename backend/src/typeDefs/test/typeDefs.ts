import { gql } from "apollo-server-lambda";
import {
  LocationType,
  RangeType,
  FilterInputType,
  DeletedType,
  SquashNodeType,
  DataType,
  ImageData,
  FilterType,
  MatchQueueType,
  FileUploadType,
  PotentialMatchUserType,
  LikedByUserType,
  LikedByUserInputType,
  PotentialMatchUserInputType,
  SquashType,
  SquashInputType,
} from '../../types/UserDefs'
//TODO: change inout ype for age to be Int! but after you configure the birthdate resolver
//TODO: need to add apollo server error handling
//TODO: ADD enum check for states and countt maybe

export const typeDefsTest = gql`
  type Mutation {
    updateAllSportFieldsTest: Squash
  }
`;

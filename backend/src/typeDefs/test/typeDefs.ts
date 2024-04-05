import { gql } from "apollo-server-lambda";
//TODO: change inout ype for age to be Int! but after you configure the birthdate resolver
//TODO: need to add apollo server error handling
//TODO: ADD enum check for states and countt maybe

export const typeDefsTest = gql`
  type Mutation {
    updateAllSportFieldsTest: User
  }
`;

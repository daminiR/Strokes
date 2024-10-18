import {gql} from '@apollo/client';

export const CREATE_REPORT_MUTATION = gql`
  mutation CreateReport(
    $reporterId: String!,
    $reportedUserId: String!,
    $reportType: String!,
    $description: String!,
  ) {
    createReport(
      reporterId: $reporterId,
      reportedUserId: $reportedUserId,
      reportType: $reportType,
      description: $description,
    ) {
      success
      message
      report {
        reporterId
        reportedUserId
        reportType
        description
        status
        createdAt
        updatedAt
      }
    }
  }
`;


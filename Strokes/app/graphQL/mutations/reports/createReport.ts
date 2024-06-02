import { gql } from 'urql';

export const CREATE_REPORT_MUTATION = gql`
  mutation CreateReport(
    $reporterId: String!,
    $reportedUserId: String!,
    $reportedContentId: String!,
    $reportType: String!,
    $description: String!,
    $status: String!
  ) {
    createReport(
      reporterId: $reporterId,
      reportedUserId: $reportedUserId,
      reportedContentId: $reportedContentId,
      reportType: $reportType,
      description: $description,
      status: $status
    ) {
      success
      message
      report {
        reportId
        reporterId
        reportedUserId
        reportedContentId
        reportType
        description
        status
        createdAt
        updatedAt
      }
    }
  }
`;


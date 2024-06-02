import { gql } from "apollo-server-lambda";

export const reportTypeDefs = gql`
  type Report {
    id: ID!
    reporterId: String!
    reportedUserId: String
    reportedContentId: String
    reportType: String!
    description: String!
    status: String!
    adminNotes: String
    createdAt: String
    updatedAt: String
  }

  type ReportResponse {
    success: Boolean!
    message: String!
    report: Report
  }

  extend type Query {
    fetchReportsForUser(
      reporterId: String!
      status: String
      page: Int!
      limit: Int!
    ): [Report!]!
    fetchReportById(reportId: ID!): Report
  }

  extend type Mutation {
    createReport(
      reporterId: String!,
      reportedUserId: String,
      reportedContentId: String,
      reportType: String!,
      description: String!
    ): ReportResponse

    updateReportStatus(
      reportId: ID!,
      status: String!
    ): ReportResponse

    deleteReport(reportId: ID!): ReportResponse
  }
`;


import { types, flow } from 'mobx-state-tree';

const ReportDataModel = types.model("ReportDataModel", {
  reportId: types.identifier,
  reporterId: types.string,
  reportedUserId: types.string,
  reportedContentId: types.string,
  reportType: types.string,
  description: types.string,
  status: types.optional(types.enumeration("Status", ["pending", "reviewed", "resolved"]), "pending"),
  createdAt: types.maybeNull(types.string),
  updatedAt: types.maybeNull(types.string),
});

export const ReportStore = types
  .model("ReportStore", {
    reports: types.array(ReportDataModel),
  })
  .actions((self) => ({
    createReportAsync: flow(function* (reportData) {
      try {
        const newReportData = {
          ...reportData,
          status: 'pending' // Default status when creating a new report
        };
        const newReport = yield createReport(newReportData);
        self.reports.push(newReport);
        return { success: true, message: "Report created successfully." };
      } catch (error) {
        console.error("Failed to create report:", error);
        return { success: false, message: "Error creating report." };
      }
    }),
    setReports(reportsData) {
      self.reports.replace(reportsData);
    },
  }));

import Report from '../../../models/reports';

export const resolvers = {
  Mutation: {
    async createReport(_, { reporterId, reportedUserId, reportType, description }) {
      try {
        // Create the report directly using the Report model
        const newReport = await Report.create({
          reporterId,
          reportedUserId,
          reportType,
          description,
          status: 'pending' // Default status when creating a new report
        });

        return {
          success: true,
          message: "Report created successfully.",
          report: newReport
        };
      } catch (error) {
        console.error(`Error creating the report: ${error}`);
        return {
          success: false,
          message: "Failed to create report.",
          report: null
        };
      }
    },

    async updateReportStatus(_, { reportId, status }) {
      try {
        const updatedReport = await Report.findByIdAndUpdate(
          reportId,
          { status },
          { new: true }
        );

        if (!updatedReport) {
          return {
            success: false,
            message: "No report found with the given ID.",
            report: null
          };
        }

        return {
          success: true,
          message: "Report status updated successfully.",
          report: updatedReport
        };
      } catch (error) {
        console.error(`Error updating the report status: ${error}`);
        return {
          success: false,
          message: "Failed to update report status.",
          report: null
        };
      }
    },

    async deleteReport(_, { reportId }) {
      try {
        const deletedReport = await Report.findByIdAndDelete(reportId);
        if (!deletedReport) {
          return {
            success: false,
            message: "Report not found.",
            report: null
          };
        }

        return {
          success: true,
          message: "Report deleted successfully.",
          report: deletedReport
        };
      } catch (error) {
        console.error(`Error deleting the report: ${error}`);
        return {
          success: false,
          message: "Failed to delete report.",
          report: null
        };
      }
    }
  }
};


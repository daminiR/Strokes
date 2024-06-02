import { Schema, model } from 'mongoose';

// Interface for a 'Report' document
interface ReportDocument {
  reporterId: string; // User ID of the person who filed the report
  reportedUserId?: string; // User ID of the person being reported, if applicable
  reportType: string; // Type of report (e.g., scam, spam, harassment)
  description: string; // Description or reason for the report
  status: "pending" | "reviewed" | "resolved"; // Current status of the report
  adminNotes?: string; // Optional field for notes by admins or moderators
}

// Report Schema definition
const reportSchema = new Schema<ReportDocument>(
  {
    reporterId: {
      type: String,
      required: true,
      index: true,
    },
    reportedUserId: {
      type: String,
      index: true,
    },
    reportType: {
      type: String,
      required: true,
      enum: [
        "scam_or_fake",
        "inappropriate_content",
        "underage_user",
        "user_in_danger",
        "code_of_conduct_breach",
        "harassment_bullying",
        "discriminatory_behavior",
        "unsportsmanlike_conduct",
        "spam_misleading",
        "unauthorized_ads",
        "privacy_violation",
      ],
    },
    description: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: ["pending", "reviewed", "resolved"],
      default: "pending",
    },
    adminNotes: {
      type: String,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt timestamps
  }
);

// Create the Mongoose model from the schema
const Report = model<ReportDocument>('Report', reportSchema);

export default Report;


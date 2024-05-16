import { Schema, model } from 'mongoose';

// Interface for a 'Match' document
interface MatchDocument {
  user1Id: string;
  user2Id: string;
  channelUrl: string;
  channelType: "private" | "group" | "supergroup";
  channelStatus: "active" | "archived" | "deleted";
  user1LastMessagePreview: string;
  user1LastMessageTimestamp: Date;
  user1UnreadMessageCount: number;
  user2LastMessagePreview: string;
  user2LastMessageTimestamp: Date;
  user2UnreadMessageCount: number;
  channelCreationDate: Date;
  channelExpiryDate: Date;
  readReceiptsStatus: boolean;
  reportedBy?: string;
  blockedBy?: string;
}
// Match Schema definition
const matchSchema = new Schema<MatchDocument>(
  {
    user1Id: {
      type: String,
      required: true,
      index: true, // Indexing for faster query performance on user1Id
    },
    user2Id: {
      type: String,
      required: true,
      index: true, // Indexing for faster query performance on user2Id
    },
    channelUrl: {
      type: String,
      required: true,
    },
    channelType: {
      type: String,
      required: true,
      enum: ["private", "group", "supergroup"], // Assuming these are the types
    },
    channelStatus: {
      type: String,
      required: true,
      enum: ["active", "archived", "deleted"],
    },
    // User-specific fields for user1
    user1LastMessagePreview: {
      type: String,
      default: "",
    },
    user1LastMessageTimestamp: {
      type: Date,
      default: Date.now,
    },
    user1UnreadMessageCount: {
      type: Number,
      default: 0,
    },
    // User-specific fields for user2
    user2LastMessagePreview: {
      type: String,
      default: "",
    },
    user2LastMessageTimestamp: {
      type: Date,
      default: Date.now,
    },
    user2UnreadMessageCount: {
      type: Number,
      default: 0,
    },
    channelCreationDate: {
      type: Date,
      default: Date.now,
      required: true,
    },
    channelExpiryDate: {
      type: Date,
      required: true,
      default: () => new Date(+new Date() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
    },
    readReceiptsStatus: {
      type: Boolean,
      default: false,
    },
    reportedBy: {
      type: String,
      default: null,
    },
    blockedBy: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true, // Mongoose automatically adds createdAt and updatedAt fields
  }
);
// Compound index to ensure unique pairs and faster querying by both user1Id and user2Id
matchSchema.index({ user1Id: 1, user2Id: 1 }, { unique: true });

// Create the Mongoose model from the schema
const Match = model<MatchDocument>('Match', matchSchema);

export default Match;


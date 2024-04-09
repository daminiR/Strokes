import { Schema, model } from 'mongoose';

// Interface for a 'Match' document
interface MatchDocument {
  user1Id: string;
  user2Id: string;
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


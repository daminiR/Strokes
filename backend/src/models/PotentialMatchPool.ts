import { Schema, model, Document } from 'mongoose';

interface PotentialMatch {
  matchUserId: Schema.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
  interacted: boolean;
}

// Extending Document to include the schema's fields for TypeScript
interface PotentialMatchPoolDocument extends Document {
  userId: Schema.Types.ObjectId;
  potentialMatches: PotentialMatch[];
}

const potentialMatchSchema = new Schema<PotentialMatch>({
  matchUserId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  interacted: { type: Boolean, default: false },
});

const potentialMatchPoolSchema = new Schema<PotentialMatchPoolDocument>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  potentialMatches: [potentialMatchSchema]
}, { timestamps: true });

// Efficiently querying by userId
potentialMatchPoolSchema.index({ userId: 1 });

// Consider a multikey index if your query patterns require it
// potentialMatchPoolSchema.index({ "potentialMatches.matchUserId": 1 }, { unique: false });

export const PotentialMatchPool = model<PotentialMatchPoolDocument>('PotentialMatchPool', potentialMatchPoolSchema);


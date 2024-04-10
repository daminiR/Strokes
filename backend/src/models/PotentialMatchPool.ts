import { Schema, model } from 'mongoose';

interface ImageSet {
  img_idx: number;
  imageURL: string;
  filePath: string;
}

interface Neighborhood {
  city: string;
  state: string;
  country: string;
}

interface Sport {
  gameLevel: number;
  sportName: string;
}

interface PotentialMatch {
  matchUserId: string;
  firstName: string;
  image_set: ImageSet[];
  age: number;
  neighborhood: Neighborhood;
  gender: string;
  sport: Sport;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
  interacted: boolean;
}

// Assuming Document from mongoose
interface PotentialMatchPoolDocument extends Document {
  _id: Schema.Types.ObjectId;
  userId: string;
  potentialMatches: PotentialMatch[];
}
export const PotentialMatchSchema = new Schema<PotentialMatchPoolDocument>(
  {
    userId: { type: String, required: true },
    potentialMatches: [
      {
        matchUserId: { type: String, ref: "User", required: true },
        firstName: { type: String, required: true },
        age: { type: Number, required: true },
        neighborhood: {
          city: { type: String, required: true },
          state: { type: String, required: true },
          country: { type: String, required: true },
        },
        gender: { type: String, required: true },
        sport: {
          gameLevel: { type: Number, required: true },
          sportName: { type: String, required: true },
        },
        description: { type: String, required: false }, // Make this optional if descriptions can be empty
        createdAt: { type: Date, default: Date.now },
        updatedAt: { type: Date, default: Date.now },
        interacted: { type: Boolean, default: false },
        image_set: [
          {
            img_idx: { type: Number, required: true },
            imageURL: { type: String, required: true },
            filePath: { type: String, required: true },
          },
        ],
      },
    ],
  },
  { collection: "potentialMatchPools" }
);

// Add an index for the userId field
PotentialMatchSchema.index({ userId: 1 }, { background: true });

// Add a compound index for matchUserId within the potentialMatches array
PotentialMatchSchema.index({ "potentialMatches.matchUserId": 1 }, { background: true });


export const PotentialMatchPool = model<PotentialMatchPoolDocument>("PotentialMatchPool", PotentialMatchSchema);


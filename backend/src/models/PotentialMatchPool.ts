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

interface Filters {
  age: {
    min: number;
    max: number;
  };
  gameLevel: {
    min: number;
    max: number;
  };
}
interface Dislike {
  _id: string;
  createdAt: Date;
  updatedAt: Date;
}

// Assuming Document from mongoose
interface PotentialMatchPoolDocument extends Document {
  _id: Schema.Types.ObjectId;
  filters: Filters;
  filtersHash: string
  userId: string;
  dislikes: Dislike[];
  swipesPerDay: number; // Added swipesPerDay here
  filtersPerDay: number; // Added swipesPerDay here
  lastUpdated: Boolean
  potentialMatches: PotentialMatch[];
}
export const PotentialMatchSchema = new Schema<PotentialMatchPoolDocument>(
  {
    userId: { type: String, required: true },
    filtersHash: { type: String, required: true },
    lastUpdated: { type: String, required: true },
    dislikes: [
      // Define dislikes as an array
      {
        _id: { type: String, required: true },
        createdAt: { type: Date, default: Date.now },
        updatedAt: { type: Date, default: Date.now },
      },
    ],
    filters: {
      // Adding filters schema
      age: {
        min: { type: Number, required: true },
        max: { type: Number, required: true },
      },
      gameLevel: {
        min: { type: Number, required: true },
        max: { type: Number, required: true },
      },
    },
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
    swipesPerDay: { type: Number, required: true, default: 30 }, // Assuming a default of 10 swipes per day
    filtersPerDay: { type: Number, required: true, default: 5 }, // Assuming a default of 10 swipes per day
  },
  { collection: "potentialMatchPools" }
);

// Add an index for the userId field
PotentialMatchSchema.index({ userId: 1 }, { background: true });

// Add a compound index for matchUserId within the potentialMatches array
PotentialMatchSchema.index({ "potentialMatches.matchUserId": 1 }, { background: true });


export const PotentialMatchPool = model<PotentialMatchPoolDocument>("PotentialMatchPool", PotentialMatchSchema);


import { Schema, model } from 'mongoose';

// Assuming the types for a 'Like' document similar to how you've structured UserDocument
interface LikeDocument {
  likerId: string;
  likedId: string;
}

// Likes Schema definition
const likesSchema = new Schema<LikeDocument>(
  {
    likerId: {
      type: String,
      required: true,
      index: true,
    },
    likedId: {
      type: String,
      required: true,
      index: true,
    },
  },
  {
    timestamps: true, // Mongoose automatically adds createdAt and updatedAt fields
  }
);

likesSchema.index({ likerId: 1, likedId: 1 });
likesSchema.index({ timestamps: -1 }); // Indexing in descending order

// Create the Mongoose model from the schema
const Like = model<LikeDocument>('Like', likesSchema);

export default Like;


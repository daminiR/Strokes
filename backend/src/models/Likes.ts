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
    },
    likedId: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true, // Mongoose automatically adds createdAt and updatedAt fields
  }
);

// Create the Mongoose model from the schema
const Like = model<LikeDocument>('Like', likesSchema);

export default Like;


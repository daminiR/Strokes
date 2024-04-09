import { Schema, model } from "mongoose";

// Define the Likes Schema
const likesSchema = new Schema(
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
  { timestamps: true } // Automatically creates createdAt and updatedAt fields
);

// Create the model from the schema
const Like = model('Like', likesSchema);

export default Like;


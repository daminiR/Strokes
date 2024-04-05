import { Schema } from "mongoose";
import { LocationSchema } from "./LocationSchema"
import * as validation from "../validation/"
import { GENDERS, LEVELS, SPORTS } from "../constants/";

const LikedByUserSchema = new Schema(
  {
    neighborhood: {
      type: LocationSchema,
    },
    firstName: {
      type: String!,
      required: true,
    },
    _id: {
      type: String!,
      required: true,
    },
    age: {
      type: Number,
      required: true,
      min: 18,
      max: 90,
    },
    gender: {
      type: String,
      required: true,
      enum: GENDERS,
    },
    sport: {
      type: [
        {
          gameLevel: { type: String, enum: LEVELS },
          sportName: { type: String, enum: SPORTS },
        },
      ],
      required: true,
      validate: [
        {
          validator: validation.imageArrayMinLimit,
          message: "Cannot have no sport, choose atleast one",
        },
        {
          validator: validation.sportsArrayMaxLimit,
          message: "Cannot have more than 5 chossen sports at a time",
        },
      ],
    },
    description: {
      type: String,
      maxlength: 300,
    },
    image_set: {
      type: [
        {
          img_idx: { type: Number },
          imageURL: { type: String },
          filePath: { type: String },
        },
      ],
      required: true,
      validate: [
        {
          validator: validation.imageArrayMinLimit,
          message: "Cannot have no images",
        },
        {
          validator: validation.imageArrayMaxLimit,
          message: "No more than 6 images",
        },
      ],
    },
  },
  { timestamps: true }
);
export { LikedByUserSchema };

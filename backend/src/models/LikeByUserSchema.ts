import { Types, model, Schema} from 'mongoose';
import { DeleteT, SquashDocument, LikedByUserT, PotentialMatchT, LocationT, PotentialMatchType, PotentialMatchSingleT} from '../types/Squash.d'
import { LocationSchema } from "./LocationSchema"
import * as validation from "../validation/"
const uri = process.env.ATLAS_URI as any
import {
  GENDERS,
  LOCATIONS,
  CITIES,
  STATES,
  COUNTRY,
  LEVELS,
  SPORTS,
  MAX_SPORTS_LIMIT
} from "../constants/";

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
    sports: {
      type: [
        {
          game_level: { type: String, enum: LEVELS },
          sport: { type: String, enum: SPORTS },
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

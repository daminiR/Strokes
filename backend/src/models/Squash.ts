import { Types, model, Schema} from 'mongoose';
import { DeleteT, SquashDocument, LikedByUserT, PotentialMatchT, LocationT, PotentialMatchType, PotentialMatchSingleT} from '../types/Squash.d'
import { LocationSchema } from "./LocationSchema"
import { PotentialMatchSchema } from "./PotentialMatchSchema"
import { LikedByUserSchema } from "./LikeByUserSchema"
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

// TODO: need to decide on what age requirement you need for your app -> 18 for now, also max requirement?
// TODO: need to figure away to allow enum values only once!
// TODO: need to check if age above 40s is really the persons age
var squashSchema = new Schema(
  {
    _id: {
      type: String!,
      required: true,
    },
    first_name: {
      type: String!,
      required: true,
      minlength: 3,
      maxlength: 30,
    },
    last_name: {
      type: String!,
      required: true,
      minlength: 3,
      maxlength: 30,
    },
    visableLikePerDay: {
      type: Number,
      required: true,
    },
    sportChangesPerDay: {
      type: Number,
      required: true,
    },
    swipesPerDay: {
      type: Number,
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
    location: {
      type: LocationSchema,
      required: true,
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
    phoneNumber: {
      type: String,
      required: false,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      unique: true,
      required: true,
      validate: [validation.validateEmail, "Please fill a valid email address"],
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please fill a valid email address",
      ],
    },
    likes: {
      type: [String],
      required: false,
    },
    likedByUSers: {
      type: [LikedByUserSchema],
      required: false,
    },
    dislikes: {
      type: [String],
      required: false,
    },
    i_blocked: [PotentialMatchSchema],
    blocked_me: [PotentialMatchSchema],
    matches: { type: [PotentialMatchSchema], required: false },
    // new additions
    deleted: {
      type: <DeleteT>{},
      required: false,
    },
    active: {
      type: Boolean,
      default: true,
      required: true,
    },
    blockedByAdmin: {
      type: Boolean,
      default: false,
      required: true,
    },
  },
  { timestamps: true }
);
const Squash = model<SquashDocument>('Squash', squashSchema)
export default Squash

import { model, Schema } from "mongoose";
import { DeleteT, UserDocument } from "../types/Squash";
import { LocationSchema } from "./LocationSchema"
import { PotentialMatchSchema } from "./PotentialMatchSchema"
import { LikedByUserSchema } from "./LikeByUserSchema"
import { GENDERS, SPORTS } from "../constants";
import * as validation from "../validation"

// TODO: need to decide on what age requirement you need for your app -> 18 for now, also max requirement?
// TODO: need to figure away to allow enum values only once!
// TODO: need to check if age above 40s is really the persons age

var userSchema = new Schema(
  {
    _id: {
      type: String!,
      required: true,
    },
    firstName: {
      type: String!,
      required: true,
      minlength: 3,
      maxlength: 30,
    },
    lastName: {
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
    matchQueue: {
      type: [
        {
          _id: { type: String, required: true },
          interacted: { type: Boolean, required: true, default: false },
          createdAt: { type: Date, required: true, default: Date.now },
          updatedAt: { type: Date, required: true, default: Date.now },
        },
      ],
      required: true,
    },
    lastFetched: { type: Date, default: Date.now }, // Tracks the last time the match queue was fetched from the server
    preferencessHash: { type: String, default: "" }, // A hash or string representation of the filters used to fetch the match queue
    preferences: {
      type: {
        gameLevel: {
          type: {
            min: {
              type: Number,
              required: true,
              min: 1,
              max: 8,
            },
            max: {
              type: Number,
              required: true,
              min: 1,
              max: 8,
            },
          },
        },
        age: {
          type: {
            min: {
              type: Number,
              required: true,
              min: 18,
              max: 90,
            },
            max: {
              type: Number,
              required: true,
              min: 18,
              max: 90,
            },
          },
        },
      },
      required: true,
    },
    sport: {
      type: {
        gameLevel: { type: Number, min: 1, max: 8 },
        sportName: { type: String, enum: SPORTS },
      },
      required: true,
    },
    neighborhood: {
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

const User = model<UserDocument>('User', userSchema)

export default User

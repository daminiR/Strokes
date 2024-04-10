import { model, Schema } from "mongoose";
import { DeleteT, UserDocument } from "../types/Squash";
import { LocationSchema } from "./LocationSchema"
import { PotentialMatchSchema } from "./PotentialMatchPool"
import { GENDERS, SPORTS } from "../constants";
import * as validation from "../validation"

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
    filtersChangesPerDay: {
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
    lastFetchedFromTrigger: { type: Date, default: Date.now }, // Tracks the last time the match queue was fetched from the server
    preferencesHash: { type: String, default: "" }, // A hash or string representation of the filters used to fetch the match queue
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
    dislikes: {
      type: [String],
      required: false,
    },
    i_blocked: [PotentialMatchSchema],
    blocked_me: [PotentialMatchSchema],
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

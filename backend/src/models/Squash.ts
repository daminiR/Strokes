import { Types, model, Schema} from 'mongoose';
import { DeleteT, SquashDocument, LikedByUserT, PotentialMatchT, LocationT, PotentialMatchType, PotentialMatchSingleT} from '../types/Squash.d'
const uri = process.env.ATLAS_URI as any
import {
  GENDERS,
  LOCATIONS,
  CITIES,
  STATES,
  COUNTRY,
  SPORTS
} from "../constants/";
const LocationSchema = new Schema({
  city: { type: String, enum: CITIES, required: true},
  state: { type: String, enum: STATES },
  country: { type: String, enum: COUNTRY },
});


const LEVELS = ['0', '1', '2']
const MAX_SPORTS_LIMIT = 5

const imageArrayMaxLimit = val => {
  return (Array.isArray(val) && val.length <= 6)
}
const sportsArrayMaxLimit = val => {
  return (Array.isArray(val) && val.length <= MAX_SPORTS_LIMIT)
}

const imageArrayMinLimit = val => {
  return (Array.isArray(val) && val.length >= 1)
}

var validateEmail = (email) => {
    var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email)
};
const _idValidator = _id => {
 return (_id === typeof(String))
}
// TODO: need to decide on what age requirement you need for your app -> 18 for now, also max requirement?
// TODO: need to figure away to allow enum values only once!
// TODO: need to check if age above 40s is really the persons age
const LikedByUserType = new Schema(
  {
    location: {
      type: LocationSchema,
    },
    first_name: {
      type: String!,
      required: true
    },
    _id: {
      type: String!,
      required: true
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
          validator: imageArrayMinLimit,
          message: "Cannot have no sport, choose atleast one",
        },
        {
          validator: sportsArrayMaxLimit,
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
          validator: imageArrayMinLimit,
          message: "Cannot have no images",
        },
        {
          validator: imageArrayMaxLimit,
          message: "No more than 6 images",
        },
      ],
    },
  },
  { timestamps: true }
)
const PotentialMatchSchema = new Schema(
  {
    _id: {
      type: String!,
      required: true
    },
    first_name: {
      type: String!,
      required: true
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
          validator: imageArrayMinLimit,
          message: "Cannot have no images",
        },
        {
          validator: imageArrayMaxLimit,
          message: "No more than 6 images",
        },
      ],
    },
    age: {
      type: Number,
      required: true,
      min: 18,
      max: 90,
    },
    location: {
      type: LocationSchema,
      required: true,
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
          validator: imageArrayMinLimit,
          message: "Cannot have no sport, choose atleast one",
        },
        {
          validator: sportsArrayMaxLimit,
          message: "Cannot have more than 5 chossen sports at a time",
        },
      ],
    },
    description: {
      type: String,
      maxlength: 300,
    },
  },
  { timestamps: true }
)
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
          validator: imageArrayMinLimit,
          message: "Cannot have no sport, choose atleast one",
        },
        {
          validator: sportsArrayMaxLimit,
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
          validator: imageArrayMinLimit,
          message: "Cannot have no images",
        },
        {
          validator: imageArrayMaxLimit,
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
      validate: [validateEmail, "Please fill a valid email address"],
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
      type: [LikedByUserType],
      required: false,
    },
    dislikes: {
      type: [String],
      required: false,
    },
    i_blocked:[PotentialMatchSchema],
    blocked_me:[PotentialMatchSchema],
    matches:[PotentialMatchSchema],
    // new additions
    deleted: {
      type: <DeleteT>{},
      required: false,
    },
    active: {
      type: Boolean,
      required: false,
    },
    blockedByAdmin: {
      type: Boolean,
      required: false,
    },
  },
  { timestamps: true }
);
const Squash = model<SquashDocument>('Squash', squashSchema)
export default Squash

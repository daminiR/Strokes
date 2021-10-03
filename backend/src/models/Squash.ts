import { Types, model, Schema} from 'mongoose';
import { SquashDocument } from '../types/Squash.d'
//const mongoose = require('mongoose');
//const Schema = mongoose.Schema;
const GENDERS = ["M", "F"]
const COUNTRY = ["US"]
const SPORTS = ["squash", "tennis"]
//const LEVELS = ["beginer", "intermediate", "expert"]
const LEVELS = [0, 1, 3]

const imageArrayMaxLimit = val => {
  return (Array.isArray(val) && val.length <= 6)
}

const imageArrayMinLimit = val => {
  return (Array.isArray(val) && val.length >= 1)
}

const _idValidator = _id => {
 return (_id === typeof(String))
}
// TODO: need to decide on what age requirement you need for your app -> 18 for now, also max requirement?
// TODO: need to figure away to allow enum values only once!
// TODO: need to check if age above 40s is really the persons age
var squashSchema = new Schema({
  _id: {
    type: String!,
    required: true,
    //validate: [
    //{
    //validator: _idValidator,
    //message: "_id provided is not an ObjectID",
    //},
    //],
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
  age: {
    type: Number,
    required: true,
    min: 18,
    max: 90,
    //TODO: fix the age and bithday category asap
    //validate: {
    //validator: Number.isInteger,
    //message: "{VALUE} is not an integer value",
    //},
  },
  gender: {
    type: String,
    required: true,
    enum: GENDERS,
  },
  sports: {
    type: [
      {
        game_level: {type: Number, enum: LEVELS},
        sport: { type: String, enum: SPORTS },
      },
    ],
    required: true,
    validate: [
      {
        validator: imageArrayMinLimit,
        message: "Cannot have no sport, choose atleast one",
      },
    ],
  },
  country: {
    type: String,
    enum: COUNTRY,
  },
  description: {
    type: String,
    maxlength: 300,
  },
  image_set: {
    type:
      {
        img_idx: { type: Number },
        imageURL: { type: String },
        filePath: { type: String },
      },
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
});
const Squash = model<SquashDocument>('Squash', squashSchema)
export default Squash

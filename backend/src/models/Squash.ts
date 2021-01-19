import { model, Schema} from 'mongoose';
import { SquashDocument } from '../types/Squash.d'
//const mongoose = require('mongoose');
//const Schema = mongoose.Schema;
const GENDERS = ["M", "F"]
const COUNTRY = ["US"]
const SPORTS = ["squash", "tennis"]
const LEVELS = ["beginer", "intermediate", "expert"]

const imageArrayMaxLimit = val => {
  return (Array.isArray(val) && val.length <= 7)
}


const imageArrayMinLimit = val => {
  return (Array.isArray(val) && val.length >= 1)
}
// TODO: need to decide on what age requirement you need for your app -> 18 for now, also max requirement?
// TODO: need to figure away to allow enum values only once!
// TODO: need to check if age above 40s is really the persons age
var squashSchema = new Schema({
  first_name: {
    type: String,
    //required: true,
    minlength: 3,
    maxlength: 30,
  },
  age: {
    type: Number,
    //required: true,
    min: 18,
    max: 90,
    //validate: {
      //validator: Number.isInteger,
      //message: "{VALUE} is not an integer value",
    //},
  },
  gender: {
    type: String,
    //required: true,
    enum: GENDERS,
  },
  sports: {
    type: [{ sport: { type: String, enum: SPORTS }, isUserSport: {type: Boolean, default: false}}],
    //required: true,
    //validate: [
      //{
        //validator: imageArrayMinLimit,
        //message: "Cannot have no sport, choose atleast one",
      //},
    //],
  },
  game_level: {
    //required: true,
    type: String,
    enum: LEVELS,
  },
  country: {
    type: String,
    enum: COUNTRY,
  },
  description: {
    type: String,
    maxlength: 500,
  },
  image_set: {
    type: [String],
    //required: true,
    //validate: [
      //{
        //validator: imageArrayMinLimit,
        //message: "Cannot have no images",
      //},
      //{
        //validator: imageArrayMaxLimit,
        //message: "No more than 7 images",
      //},
    //],
  },
});
const Squash = model<SquashDocument>('Squash', squashSchema)
export default Squash

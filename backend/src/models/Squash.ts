import { model, Schema} from 'mongoose';
import { SquashDocument } from '../types/Squash.d'
//const mongoose = require('mongoose');
//const Schema = mongoose.Schema;
const GENDERS = ["M", "F"]
const SPORTS = ["squash", "tennis"]
const LEVELS = ["beginer", "intermediate", "expert"]

var squashSchema = new Schema({
  first_name: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true,
    validate: {
      validator: Number.isInteger,
      message: "{VALUE} is not an integer value",
    },
  },
  gender: {
    type: String,
    required: true,
    enum: GENDERS,
  },
  sports: {
    type: String,
    enum: SPORTS,
  },
  game_level: {
    type: String,
    enum: LEVELS,
  },
  country: {
    type: String,
  },
  description: {
    type: String
  },
  image_set: {
    type: String
  }
});

const Squash = model<SquashDocument>('Squash', squashSchema)
export default Squash

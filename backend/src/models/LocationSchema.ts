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
  city: { type: String, enum: CITIES, required: true },
  state: { type: String, enum: STATES },
  country: { type: String, enum: COUNTRY },
});
export { LocationSchema };

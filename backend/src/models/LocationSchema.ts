import { Schema} from 'mongoose';
import { CITIES, STATES, COUNTRY } from "../constants/";

const LocationSchema = new Schema({
  city: { type: String, enum: CITIES, required: true },
  state: { type: String, enum: STATES },
  country: { type: String, enum: COUNTRY },
});
export { LocationSchema };

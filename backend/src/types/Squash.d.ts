import { Document, Model} from 'mongoose'

export interface SquashDocument extends Document {
  first_name: string
  age : number
  gender: string
  sports: [{sport: string, isUserSport: string}]
  game_level: string
  country: string
  description: [string]
  image_set: string
}



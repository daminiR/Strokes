import { Document, Model} from 'mongoose'

export interface SquashDocument extends Document {
  first_name: string
  age : string
  gender: string
  sports: [{game_level: number, sport: string}]
  country: string
  description: [string]
  image_set: [{img_idx: number, imageURL: string, filePath: string}]
}



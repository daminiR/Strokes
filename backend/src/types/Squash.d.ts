import { Document, Model} from 'mongoose'

export interface SquashDocument extends Document {
  first_name: string
  last_name: string
  age : number
  gender: string
  sports: [{game_level: number, sport: string}]
  country: string
  description: [string]
  image_set: [{img_idx: number, imageURL: string, filePath: string}]
}



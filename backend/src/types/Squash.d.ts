import { Document, Model} from 'mongoose'
export interface ImageSetT {
  imageURL: string;
  img_idx: number;
  filePath: string;
}

export interface Sport {
  sport: string;
  game_level: number;
}
export interface LocationT {
  city: string;
  state: string;
  country: string;
}
export interface FilterT {
  ageRange: string;
  sport: string;
  filterLevel: string;
}

export interface PotentialMatchType {
    first_name: string
    _id: string
    age: number
    gender: string
    sports: Sport[],
    description: string
    image_set: ImageSetT[]
}
export type PotentialMatchT = PotentialMatchType[]
export type SportsList = Sport[]

export interface SquashDocument extends Document {
  first_name: string
  last_name: string
  age : number
  gender: string
  sports: SportsList
  location: LocationT
  description: [string]
  image_set: ImageSetT[]
  matched : PotentialMatchT
  blocked_me : PotentialMatchT
  i_blocked : PotentialMatchT
  likes : PotentialMatchT
  dislikes : PotentialMatchT
}



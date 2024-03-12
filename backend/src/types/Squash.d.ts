import { Document, Model} from 'mongoose'
interface Data {
  img_idx: number;
  imageURL: string;
  filePath: string;
}
interface DisplayData {
  imageURL: string;
  filePath: string;
}
interface MessageType {
  sender: string
  receiver: string
  text: string;
}
export interface ImageSetT {
  imageURL: string;
  img_idx: number;
  filePath: string;
}
export interface DeleteT {
  isDeleted: boolean;
  deletedAt: ISODate;
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
    firstName: string
    _id: string
    age: number
    gender: string
    sports: Sport[],
    description: string
    image_set: ImageSetT[]
}
export interface LikedByUserType {
    firstName: string
    _id: string
    age: number
    profileImage: ImageSetT
}
export type PotentialMatchT = PotentialMatchType[]
export type PotentialMatchSingleT= PotentialMatchType
export type LikedByUserT = LikedByUserType[]
export type SportsList = Sport[]
export interface SquashDocument extends Document {
  firstName: string
  lastName: string
  age : number
  gender: string
  sports: SportsList
  neighborhood: LocationT
  description: [string]
  image_set: ImageSetT[]
  matches : PotentialMatchT
  blocked_me : PotentialMatchT
  i_blocked : PotentialMatchT
  likes : PotentialMatchT
  dislikes : PotentialMatchT
  deleted : DeleteT
  active : Boolean
  blockedByAdmin : Boolean
  phoneNumber : String
  email : String
  swipesPerDay : number
  visableLikePerDay : number
  sportChangesPerDay : number
}


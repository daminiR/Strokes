import { Document, Model} from 'mongoose'
interface Data {
  img_idx: number;
  imageURL: string;
  filePath: string;
}
export interface FileUploadType {
  img_idx: Int!;
  ReactNativeFile: Upload!;
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
  sportName: string;
  gameLevel: number;
}
export interface LocationT {
  city: string;
  state: string;
  country: string;
}
export interface FilterType {
  age: { min: number; max: number };
  gameLevel: { min: number; max: number };
}

export interface PotentialMatchType {
    firstName: string
    _id: string
    age: number
    gender: string
    sport: Sport,
    description: string
    image_set: ImageSetT[]
}
export interface MatchQueueType {
    _id: string
    interacted: boolean
}

export interface LikedByUserType {
    firstName: string
    _id: string
    age: number
    profileImage: ImageSetT
}
export type PotentialMatchT = PotentialMatchType[]
export type MatchQueueT = MatchQueueType[]
export type PotentialMatchSingleT= PotentialMatchType
export type LikedByUserT = LikedByUserType[]

export interface UserDocument extends Document {
  firstName: string
  lastName: string
  age : number
  gender: string
  sport: Sport
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
  lastFetchedFromTrigger : string
  visableLikePerDay : number
  sportChangesPerDay : number
  matchQueue: MatchQueueT
  filtersChangesPerDay: numer!
}


export interface ImageSetT {
  imageURL: string;
  img_idx: number;
  filePath: string;
}
export interface LocationT {
  city: string;
  state: string;
  country: string;
}
export interface Sport {
  sport: string;
  game_level: number;
}
export interface SportFilters {
  sport: string;
  filterSelected: boolean;
}
export interface Name {
  FirstName: string;
  LastName: string;
}
export interface SportType {
    first_name: string
    last_name: string
    _id: string
    age: number
    gender: string
    sports: [SquashNodeInput]
    country: string
    description: string
    image_set: [DataInput]
    matched : [SquashInput]
    blocked_me : [SquashInput]
    i_blocked : [SquashInput]
    likes : [SquashInput]
    dislikes : [SquashInput]
}
export interface PotentialMatchType {
    first_name: string
    _id: string
    age: number
    location: LocationT
    gender: string
    sports: Sport[],
    description: string
    image_set: ImageSetT[]
}
export interface PatronListType {
    first_name: string
    _id: string
    age: number
    gender: string
    sports: Sport[],
    description: string
    location: LocationT
    image_set: ImageSetT[]
}
export interface FilterFields {
  ageRange: {minAge: number; maxAge: number};
  sportFilters: SportFilters;
  gameLevels: {gameLevel0: boolean, gameLevel1: boolean, gameLevel2: boolean};
}
export interface PasswordResetFields {
  passwordResetCode: string;
  newPassword: string;
}
export interface ProfileFields {
  email: string;
  phoneNumber: string;
  first_name: string;
  last_name: string;
  age: string;
  gender: string;
  location: LocationT;
  sports: [{sport: string; game_level: number}];
  image_set: [{imageURL: string; img_idx: number; filePath: string}];
  confirmationCode: string;
  password: string;
  description: string;
}
export interface EditFields {
       email: string;
       phoneNumber: string;
       first_name: string,
       last_name: string,
       age: string,
       gender: string,
       location: LocationT,
       sports: [{sport: string, game_level:number}],
       image_set: [{imageURL: string, img_idx: number, filePath:string}],
       remove_uploaded_images: [{imageURL: string, img_idx: number, filePath:string}],
       add_local_images: [{imageURL: string, img_idx: number, filePath:string}],
       original_uploaded_image_set: [{imageURL: string, img_idx: number, filePath:string}],
       //confirmationCode: string,
       description: string,
}
export interface SignInFields {
       phoneNumber: string;
       password: string
       newPassword: string
       verificationCode: string
}
export interface InputType {
       inputType: string;
       displayInput: boolean;
}
export type SportsList = Sport[]
export type NameT = Name
export type InputT = InputType
export type PotentialMatchT = PotentialMatchType[]


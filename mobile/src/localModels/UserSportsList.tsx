export interface ImageSetT {
  imageURL: string;
  img_idx: number;
  filePath: string;
}
export interface Sport {
  sport: string;
  game_level: number;
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
    likes: PotentialMatchType[]
    image_set: ImageSetT[]
}
export interface ProfileFields {
  email: string;
  phoneNumber: string;
  first_name: string;
  last_name: string;
  age: string;
  gender: string;
  sports: [{sport: string; game_level: number}];
  image_set: [{imageURL: string; img_idx: number; filePath: string}];
  confirmationCode: string;
  description: string;
}
export interface EditFields {
       email: string;
       phoneNumber: string;
       first_name: string,
       last_name: string,
       age: string,
       gender: string,
       sports: [{sport: string, game_level:number}],
       image_set: [{imageURL: string, img_idx: number, filePath:string}],
       remove_uploaded_images: [{imageURL: string, img_idx: number, filePath:string}],
       add_local_images: [{imageURL: string, img_idx: number, filePath:string}],
       original_uploaded_image_set: [{imageURL: string, img_idx: number, filePath:string}],
       confirmationCode: string,
       description: string
}
export interface SignIn {
       email: string;
       phoneNumber: string;
       confirmationCode: string
}
export interface InputType {
       inputType: string;
       displayInput: boolean;
}
export type SportsList = Sport[]
export type NameT = Name
export type InputT = InputType
export type PotentialMatchT = PotentialMatchType[]


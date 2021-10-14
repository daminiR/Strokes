export interface Sport {
  sport: string;
  game_level: number;
}
export interface Name {
  FirstName: string;
  LastName: string;
}
export interface ProfileFields {
       email: string;
       phoneNumber: string;
       first_name: string,
       last_name: string,
       age: string,
       gender: string,
       sports: [{sport: string, game_level:number}],
       image_set: [{imageURL: string, img_idx: number, filePath:string}],
       confirmationCode: string,
       description: string
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


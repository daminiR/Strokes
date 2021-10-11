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
       sports: string,
       images: [string],
       confirmationCode: string
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


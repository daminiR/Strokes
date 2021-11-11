import { Document, Model} from 'mongoose'
export interface UserMessageType {
    _id: string
    userName: string
    avatar: string
}
export interface MessageType {
    _id: string
    text: string
    user: UserMessageType
}
export type MessageT = MessageType[]

export interface MessageDocument extends Document {
  sender: string
  receiver: string
  text: string
}



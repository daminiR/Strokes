import { Document, Model} from 'mongoose'


export interface ConversationDocument extends Document {
  participants: string
}

export interface MessageDocument extends Document {
  _id: objectId,
  sender: string
  text: string
  receiver: string
  createdAt: ISODate
}





import { Document, Model} from 'mongoose'


export interface ConversationDocument extends Document {
  participants: string
}

export interface MessageDocument extends Document {
  sender: string
  text: string
  conversationID: ObjectId
}





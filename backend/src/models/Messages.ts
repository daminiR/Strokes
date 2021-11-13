import { Types, model, Schema} from 'mongoose';
import { MessageDocument} from '../types/Messages.d'
import { ObjectId } from 'mongodb'

var messageSchema = new Schema({
  _id: {
    type: ObjectId,
    required: true
  },
  receiver: {
    type: String!,
    required: true,
  },
  sender: {
    type: String!,
    required: true,
  },
  text: {
    type: String!,
    required: true,
    maxlength: 3000,
  },
});
const Message = model<MessageDocument>('Messages', messageSchema)
export default Message

import { Types, model, Schema} from 'mongoose';
import { MessageDocument} from '../types/Messages.d'

var messageSchema = new Schema({
  sender: {
    type: String!,
    required: true,
  },
  receiver: {
    type: String!,
    required: true,
  },
  text: {
    type: String!,
    required: true,
    minlength: 3,
    maxlength: 3000,
  },
});
const Message = model<MessageDocument>('Messages', messageSchema)
export default Message

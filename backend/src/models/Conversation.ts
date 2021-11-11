import { Types, model, Schema} from 'mongoose';
import { ConversationDocument} from '../types/Messages.d'

var ConvesationSchema = new Schema({
  participants: {
    type: [String!]!,
    required: true,
  }
});
const Conversation = model<ConversationDocument>('Conversation', ConvesationSchema)
export default Conversation

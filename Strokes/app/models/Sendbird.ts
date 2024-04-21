import { types, flow, getRoot, Instance } from 'mobx-state-tree';
import SendBird from '@sendbird/chat';
import {GroupChannel, GroupChannelHandler, MessageCollection, MessageCollectionInitPolicy} from '@sendbird/chat/groupChannel';

const MessageModel = types.model({
  messageId: types.identifierNumber,
  text: types.string,
  senderId: types.string,
  createdAt: types.Date
});

const ChannelModel = types.model({
  channelId: types.identifier,
  name: types.string,
  lastMessage: types.maybeNull(types.reference(MessageModel)),
  unreadMessageCount: types.number
});

const ChatStore = types.model({
  currentUser: types.maybe(types.string),
  channels: types.array(ChannelModel),
  messages: types.map(types.array(types.reference(MessageModel))),
  selectedChannelId: types.maybe(types.string),
  isConnected: types.optional(types.boolean, false)
})
.actions(self => ({
  connect: flow(function* (userId, accessToken) {
    const sb = new SendBird({appId: 'YOUR_APP_ID'});
    try {
      const user = yield sb.connect(userId, accessToken);
      self.currentUser = user.userId;
      self.isConnected = true;
      yield self.loadChannels();
    } catch (error) {
      console.error('Connection failed:', error);
      throw error;
    }
  }),

  loadChannels: flow(function* () {
    const sb = new SendBird({appId: 'YOUR_APP_ID'});
    const query = sb.GroupChannel.createMyGroupChannelListQuery();
    const channels = yield query.next();
    self.channels.replace(channels.map(channel => ({
      channelId: channel.url,
      name: channel.name,
      lastMessage: channel.lastMessage ? {
        messageId: channel.lastMessage.messageId,
        text: channel.lastMessage.message,
        senderId: channel.lastMessage.sender.userId,
        createdAt: new Date(channel.lastMessage.createdAt)
      } : null,
      unreadMessageCount: channel.unreadMessageCount
    })));
  }),

  selectChannel: flow(function* (channelUrl) {
    self.selectedChannelId = channelUrl;
    yield self.initializeCollection(channelUrl);
  }),

  initializeCollection: flow(function* (channelUrl) {
    const sb = new SendBird({appId: 'YOUR_APP_ID'});
    const channel = yield sb.GroupChannel.getChannel(channelUrl);
    const collection = channel.createMessageCollection();
    collection.initialize(MessageCollectionInitPolicy.CACHE_AND_REPLACE_BY_API);
    const messages = yield collection.loadPreviousMessages(MessageCollectionInitPolicy.CACHE_AND_REPLACE_BY_API);
    self.messages.set(channelUrl, messages.map(message => ({
      messageId: message.messageId,
      text: message.message,
      senderId: message.sender.userId,
      createdAt: new Date(message.createdAt)
    })));
    channel.markAsRead();
  }),
  // Add additional actions for handling message updates, deletions, etc.
}))
.views(self => ({
  get currentChannelMessages() {
    return self.messages.get(self.selectedChannelId) || [];
  },
  get currentChannel() {
    return self.channels.find(channel => channel.channelId === self.selectedChannelId);
  }
}));

export default ChatStore;


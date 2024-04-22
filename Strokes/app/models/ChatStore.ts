import { types, flow, Instance } from 'mobx-state-tree';
import { GroupChannelHandler, MessageCollectionInitPolicy} from '@sendbird/chat/groupChannel';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SendbirdChat from "@sendbird/chat"
import { GroupChannelModule, MessageCollection, GroupChannel } from "@sendbird/chat/groupChannel"

const APP_ID = process.env.REACT_APP_SENDBIRD_APP_ID
// Define User Model
const ChannelModel = types.model({
  channel: types.frozen(),
  collection: types.frozen(),
});
const UserModel = types.model({
  userId: types.identifier,
  nickname: types.string,
  accessToken: types.maybeNull(types.string),
});

// Define the ChatStore
export const ChatStore = types
  .model({
    currentUser: types.maybe(UserModel),
    isConnected: types.optional(types.boolean, false),
    sdk: types.maybe(types.frozen()), // Store the SDK instance once initialized
    channel: types.optional(types.frozen(), {}),
    collection: types.optional(types.frozen(), {}),
  })
  .actions((self) => ({
    setChannel(channel: GroupChannel) {
      self.channel = channel
    },
    setCollection(collection: MessageCollection) {
      self.collection = collection
    },
    resetChannelAndCollection: () => {
    if (self.collection) {
      self.collection.dispose(); // Dispose of the collection properly.
    }
    self.collection = {} // Reset the channel and collection to initial state.
    self.channel = {}; // Reset the channel and collection to initial state.
  },
    initializeCollection: flow(function* (channelUrl: string, setState: any, rerender: any) {
      //if (!self.sdk) return
      self.sdk.groupChannel
        .getChannel(channelUrl)
        .then((channel) => {
          const collection =  channel.createMessageCollection()
          collection.setMessageCollectionHandler({
            onChannelDeleted: () => {
              console.log("Channel deleted")
            },
            onChannelUpdated: (channel) => {
              //self.setChannel(channel)
            },
            onMessagesUpdated: (context, channel, messages) => {
              // Implement necessary updates or callbacks
            },
            onMessagesAdded: (context, channel, messages) => {
              // Implement necessary updates or callbacks
            },
            onMessagesDeleted: (context, channel, messages) => {
              // Implement necessary updates or callbacks
            },
            onHugeGapDetected: () => {
              // Optionally re-initialize or handle accordingly
            },
          })
      collection
        .initialize(MessageCollectionInitPolicy.CACHE_AND_REPLACE_BY_API)
        .onCacheResult((err: any, messages: any) => {
          console.log("vals", messages, err)
          if (messages?.length && messages.length > 0) {
            console.log("GroupChannelScreen:", "onCacheResult", messages.length)

            rerender()
          }
          console.log("debug m state", channel. collection)
          setState({ channel, collection })
        })
        .onApiResult((err: any, messages: any) => {
          if (messages?.length && messages.length > 0) {
            console.log("GroupChannelScreen:", "onApiResult", messages.length)

            rerender()
          }
          setState({ channel, collection })
          console.log("so we make it here", channel. collection)
        })

      channel.markAsRead()



        })
        .catch((err: any) => console.log(err))
      //console.log("here", channel)

    }),
    initializeSDK: flow(function* () {
      //if (!self.sdk) {
      const sdkPromise = new Promise((resolve) => {
        const sdk = SendbirdChat.init({
          appId: APP_ID,
          modules: [new GroupChannelModule()],
          useAsyncStorageStore: AsyncStorage,
          localCacheEnabled: true,
        })
        resolve(sdk)
      })
      self.sdk = yield sdkPromise
      console.log("SDK Initialized:", self.sdk)
      //}
    }),
    connect: flow(function* (userId: string, nickname: string, accessToken: string) {
      try {
        const user = yield self.sdk.connect(userId, accessToken)
        self.currentUser = UserModel.create({
          userId: user.userId,
          nickname: nickname,
          accessToken: accessToken,
        })
        self.isConnected = true
        console.log("User connected:", self.currentUser.nickname)
      } catch (error) {
        console.error("Connection failed:", error)
        throw error
      }
    }),
    disconnect: flow(function* () {
      try {
        yield self.sdk.disconnect()
        self.currentUser = undefined
        self.isConnected = false
        console.log("User disconnected")
      } catch (error) {
        console.error("Disconnect failed:", error)
        throw error
      }
    }),
  }))
  .views((self) => ({
    get isUserConnected() {
      return self.isConnected && self.currentUser != null
    },
  }))

// Export types for better TypeScript integration
export type IChatStore = Instance<typeof ChatStore>;

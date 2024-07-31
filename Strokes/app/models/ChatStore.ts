import {types, flow, Instance, cast} from 'mobx-state-tree';
import {GroupChannelCollection} from "@sendbird/chat/groupChannel";
import {CollectionEventSource} from '@sendbird/chat';
import {MessageCollectionInitPolicy} from '@sendbird/chat/groupChannel';
import {withSetPropAction} from "./helpers/withSetPropAction"
import storage from 'app/utils/storage/mmkvStorage';
import {getRootStore} from "./helpers/getRootStore"
import SendbirdChat from "@sendbird/chat"
import {GroupChannelModule, MessageCollection, GroupChannel} from "@sendbird/chat/groupChannel"

export const LocationModel = types.model("LocationModel", {
  city: types.maybeNull(types.string),
  state: types.maybeNull(types.string),
  country: types.maybeNull(types.string),
})
export const SportModel = types.model("SportModel", {
  sportName: types.maybeNull(types.string),
  gameLevel: types.maybeNull(types.number),
})
export const ImageModel = types.model("ImageModel", {
  img_idx: types.maybeNull(types.number),
  imageURL: types.maybeNull(types.string),
});
const Range = types.model("RangeModel", {
  min: types.maybeNull(types.number),
  max: types.maybeNull(types.number),
});
export const PreferencesModel = types.model("PreferencesModel", {
  age: types.maybeNull(Range),
  gameLevel: types.maybeNull(Range),
});
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
})
export const ChatModel = types.model("ChatModel", {
  channelUrl: types.maybeNull(types.string),
  channelType: types.maybeNull(types.string),
  channelStatus: types.maybeNull(types.string),
  lastMessagePreview: types.maybeNull(types.string),
  lastMessageTimestamp: types.maybeNull(types.string),
  unreadMessageCount: types.maybeNull(types.number),
  channelCreationDate: types.maybeNull(types.string),
  channelExpiryDate: types.maybeNull(types.string),
  readReceiptsStatus: types.maybeNull(types.boolean),
  reportedBy: types.maybeNull(types.string),
  blockedBy: types.maybeNull(types.string),
})

const CurrentChatModel = types.model("CurrentChatModel", {
  matchId: types.maybeNull(types.string),
  matchedUserId: types.maybeNull(types.string),
  firstName: types.maybeNull(types.string),
  age: types.maybeNull(types.number),
  gender: types.maybeNull(types.string),
  sport: types.maybeNull(SportModel),
  description: types.maybeNull(types.string),
  imageSet: types.optional(types.array(ImageModel), []),
  neighborhood: LocationModel,
  chat: types.optional(ChatModel, {}),
});

// Define the ChatStore
export const ChatStore = types
  .model({
    currentUser: types.maybe(UserModel),
    isConnected: types.optional(types.boolean, false),
    sdk: types.maybe(types.frozen()), // Store the SDK instance once initialized
    channelUrl: types.optional(types.frozen(), {}),
    collection: types.maybeNull(types.frozen<GroupChannelCollection>()),
    currentChatProfile: types.maybe(CurrentChatModel),
    channelType: types.maybeNull(types.string),
    channelStatus: types.maybeNull(types.string),
    lastMessagePreview: types.maybeNull(types.string),
    lastMessageTimestamp: types.maybeNull(types.string),
    unreadMessageCount: types.maybeNull(types.number),
    channelCreationDate: types.maybeNull(types.string),
    channelExpiryDate: types.maybeNull(types.string),
    readReceiptsStatus: types.maybeNull(types.boolean),
    reportedBy: types.maybeNull(types.string),
    blockedBy: types.maybeNull(types.string),
  })
  .actions(withSetPropAction)
  .actions((self) => ({
    setCollection(collection: any) {
      self.collection = collection
    },
    setChannel(channel: GroupChannel) {
      self.channelUrl = channel
    },
    setChatProfile(profile: any) {
      self.currentChatProfile = {
        matchId: profile.matchId,
        matchedUserId: profile.matchedUserId || null,
        firstName: profile.firstName || null,
        age: profile.age || null,
        gender: profile.gender || null,
        sport: SportModel.create({
          sportName: profile.sport.sportName,
          gameLevel: profile.sport.gameLevel,
        }), // Handle nested models correctly
        description: profile.description || null,
        imageSet: profile.imageSet.map((img: any) =>
          ImageModel.create({
            img_idx: img.img_idx,
            imageURL: img.imageURL,
          }),
        ),
        neighborhood: LocationModel.create({
          city: profile.neighborhood.city,
          state: profile.neighborhood.state,
          country: profile.neighborhood.country,
        }), // Provide a default model if null
      }

      // Set chat detail
      self.channelUrl = profile.chat.channelUrl || null
      self.channelType = profile.chat.channelType || null
      self.channelStatus = profile.chat.channelStatus || null
      self.lastMessagePreview = profile.chat.lastMessagePreview || null
      self.lastMessageTimestamp = profile.chat.lastMessageTimestamp || null
      self.unreadMessageCount = profile.chat.unreadMessageCount || null
      self.channelCreationDate = profile.chat.channelCreationDate || null
      self.channelExpiryDate = profile.chat.channelExpiryDate || null
      self.readReceiptsStatus = profile.chat.readReceiptsStatus || null
      self.reportedBy = profile.chat.reportedBy || null
      self.blockedBy = profile.chat.blockedBy || null
    },
    resetChannelAndCollection: () => {
      if (self.collection) {
        self.collection.dispose() // Dispose of the collection properly.
      }
      self.collection = {} // Reset the channel and collection to initial state.
      self.channelUrl = {} // Reset the channel and collection to initial state.
    },
    initializeCollection: flow(function* (channelUrl: string, setState: any, rerender: any) {
      //if (!self.sdk) return
      self.sdk.groupChannel
        .getChannel(channelUrl)
        .then((channel) => {
          const collection = channel.createMessageCollection()
          collection.setMessageCollectionHandler({
            onChannelDeleted: () => {},
            onChannelUpdated: (_, channel) => {
              setState((prev) => (prev ? {...prev, channel} : prev))
            },
            onMessagesUpdated: (context, channel, messages) => {
              // Implement necessary updates or callbacks
              rerender()
            },
            onMessagesAdded: (context, channel, messages) => {
              // Implement necessary updates or callbacks
              rerender()
              if (
                [
                  CollectionEventSource.SYNC_MESSAGE_FILL,
                  CollectionEventSource.EVENT_MESSAGE_RECEIVED,
                ].includes(context.source)
              ) {
                channel.markAsRead()
              }
            },
            onMessagesDeleted: (context, channel, messages) => {
              // Implement necessary updates or callbacks
              self.initializeCollection(channelUrl, setState, rerender)
            },
            onHugeGapDetected: () => {
              // Optionally re-initialize or handle accordingly
            },
          })
          collection
            .initialize(MessageCollectionInitPolicy.CACHE_AND_REPLACE_BY_API)
            .onCacheResult((err: any, messages: any) => {
              if (messages?.length && messages.length > 0) {
                console.log("GroupChannelScreen:", "onCacheResult", messages.length)
                rerender()
              }
              setState({channel, collection})
            })
            .onApiResult((err: any, messages: any) => {
              if (messages?.length && messages.length > 0) {
                console.log("GroupChannelScreen:", "onApiResult", messages.length)

                rerender()
              }
              setState({channel, collection})
            })

          channel.markAsRead()
        })
        .catch((err: any) => console.log(err))
      //console.log("here", channel)
    }),
    initializeSDK: flow(function* () {
      try {
        // Check if SDK is already initialized
        //if (self.sdk) {
        //console.log("SDK is already initialized:", self.sdk);
        //return;
        //}

        // Ensure that the storage is initialized
        if (!storage) {
          console.error("Storage is not initialized.");
          return;
        }

        // Initialize the Sendbird SDK
        const sdk = SendbirdChat.init({
          appId: APP_ID, // Ensure APP_ID is defined and correct
          modules: [new GroupChannelModule()],
          useMMKVStorageStore: storage,
          localCacheEnabled: true,
        });

        // Set the SDK instance to self.sdk
        self.sdk = sdk;

        // Log the initialized SDK instance
        console.log("SDK Initialized:", self.sdk);
      } catch (error) {
        // Log any errors that occur during initialization
        console.error("Error initializing SDK:", error);
      }

    }),
    setSDK(sdk: any) {
      self.sdk = sdk
    },
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
      const authStore = getRootStore(self).authenticationStore
      if (!self.sdk) {
        console.error("SDK not initialized")
        return // Optionally, you might handle this situation more gracefully
      }
      try {
        yield self.sdk.disconnect()
        console.log("User disconnected")
      } catch (error) {
        console.error("Disconnect failed:", error)
        throw error // Rethrowing the error is optional and should be based on how you handle errors upstream
      } finally {
        // Always reset user and connection status regardless of try/catch result
        self.currentUser = undefined
        self.isConnected = false
        authStore.setProp("isSDKConnected", false)
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

import { types, flow, Instance } from 'mobx-state-tree';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SendbirdChat from '@sendbird/chat';
import { GroupChannelModule } from '@sendbird/chat/groupChannel';

const APP_ID = process.env.REACT_APP_SENDBIRD_APP_ID
// Define User Model
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
  })
  .actions((self) => ({
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

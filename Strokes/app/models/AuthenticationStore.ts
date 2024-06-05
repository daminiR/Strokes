import { types, flow, cast, SnapshotOrInstance, SnapshotOut, Instance, getRoot} from 'mobx-state-tree';
import {PermissionsAndroid, Platform } from 'react-native';
import messaging from '@react-native-firebase/messaging'
import {
  CognitoUser,
  CognitoUserAttribute,
  AuthenticationDetails,
  CognitoUserPool,
} from "amazon-cognito-identity-js"
import { resetChatStackToChatList, resetToInitialState } from "./../navigators"
import { UserStoreModel } from "./UserStore"
import { getRootStore } from "./helpers/getRootStore"
import { removeStore } from "./helpers/removeRootStore"
import storage from 'app/utils/storage/mmkvStorage';

const userID = "0c951930-a533-4430-a582-5ce7ec6c61bc"
const accessToken = "6572603456b4d9f1b6adec6c283ef5adc6099418"

async function requestUserPermission() {
  const authorizationStatus = await messaging().requestPermission();
  return authorizationStatus === messaging.AuthorizationStatus.AUTHORIZED ||
         authorizationStatus === messaging.AuthorizationStatus.PROVISIONAL;
}

if (Platform.OS === 'ios') {
  requestUserPermission().then(hasPermission => {
    if (hasPermission) {
      // Continue with getting the token and registering it...
    }
  });
}
const FileType = types.model("FileType", {
  uri: types.string,
  type: types.optional(types.string, "image/jpeg"), // Default to 'image/jpeg'
  name: types.string,
})
// Define a model for User
const poolData = {
          UserPoolId: process.env.REACT_APP_USER_POOL_ID3,
          ClientId: process.env.REACT_APP_APP_CLIENT_ID3,
};
const TokenType = types.model("TokenType", {
  idToken: types.string,
  accessToken: types.string,
  refreshToken: types.string,
});
const userPool = new CognitoUserPool(poolData);
 //Define the AuthStore model
export const AuthenticationStoreModel = types
  .model("AuthenticationStoreModel", {
    tokens: types.maybeNull(TokenType),
    isSDKConnected: types.optional(types.boolean, false),
    user: types.maybeNull(UserStoreModel),
    isLoading: types.maybeNull(types.boolean),
    isAuthenticated: types.optional(types.boolean, false),
    verificationPhoneCode: types.maybeNull(types.string),
    error: types.maybeNull(types.string),
  })
  .actions((self) => ({
    setTokens(tokens) {
      self.tokens = tokens
    },
    syncUserPoolStorage: flow(function* (userPool) {
      return new Promise((resolve, reject) => {
        userPool.storage.sync((err, result) => {
          if (err) {
            reject(err)
          } else if (result === "SUCCESS") {
            resolve(userPool.getCurrentUser())
          } else {
            reject(new Error("Storage sync failed"))
          }
        })
      })
    }),
    setUserSession: flow(function* (session) {
      const userStore = getRoot(self).userStore
      const idToken = session.getIdToken().getJwtToken()
      const accessToken = session.getAccessToken().getJwtToken()
      const refreshToken = session.getRefreshToken().getToken()
      const userSub = session.getIdToken().payload.sub

      self.setTokens({ idToken, accessToken, refreshToken })
      userStore.setID(userSub)
    }),
    checkUserSession: flow(function* (userPool, userStore) {
      try {
        const cognitoUser = yield self.syncUserPoolStorage(userPool)
        if (cognitoUser == null) {
          console.log("No current Cognito user")
          throw new Error("No current Cognito user")
        }

        const session = yield new Promise((resolve, reject) => {
          cognitoUser.getSession((err, session) => {
            if (err || !session.isValid()) {
              reject(err || new Error("Session is invalid"))
            } else {
              resolve(session)
            }
          })
        })

        yield self.setUserSession(session)
        return session
      } catch (error) {
        console.error("Error checking user session:", error)
        throw error
      }
    }),
    handlePostAuthenticationActions: flow(function* () {
      const userStore = getRoot(self).userStore
      const mongoDBStore = getRoot(self).mongoDBStore
      const chatStore = getRoot(self).chatStore

      try {
        const userSub = userStore._id
        const accessToken = userStore.accessToken
        yield mongoDBStore.queryUserFromMongoDB(userSub)
        yield mongoDBStore.queryPotentialMatches()
        yield chatStore.initializeSDK()
        yield chatStore.connect(userSub, "Damini Rijhwani Android", accessToken)
        self.setSDKConnected(true)
        console.log("Chat SDK initialized and connected:", chatStore.sdk)

        yield self.registerDeviceToken()
        console.log("Registered for push notifications")

        self.setIsAuthenticated(true)
      } catch (error) {
        console.error("Error during post-authentication actions:", error)
        self.setError(error.message || "Error during post-authentication actions")
        self.signOut()
        throw error
      }
    }),
    setLoading(loading: boolean) {
      self.isLoading = loading
    },
    setError(error: any) {
      self.error = error
    },
    clearUserSession: flow(function* () {
      self.setIsAuthenticated(false)
      yield removeStore()
      yield storage.clearAll()
    }),
    setSDKConnected(isConnected: boolean) {
      self.isSDKConnected = isConnected
    },
    setIsAuthenticated(isAuthenticated: boolean) {
      self.isAuthenticated = isAuthenticated
    },
    unregisterPushNotifications: flow(function* () {
      const chatStore = getRoot(self).chatStore // Ensure you have access to the Sendbird instance
      try {
        // Ensure we have a current user and a valid connection before attempting to unregister
        if (chatStore.isConnected && chatStore.sdk.currentUser) {
          const pushToken = yield storage.getString("pushToken")
          if (pushToken) {
            yield chatStore.sdk.unregisterPushToken(
              pushToken,
              function (response: any, error: any) {
                if (error) {
                  console.error("Failed to deregister push token:", error)
                  throw error // Optional: throw to handle errors in the caller function
                } else {
                  console.log("Push token deregistered successfully.")
                }
              },
            )
            // Remove the token from storage after successful deregistration
            yield storage.delete("pushToken")
          }
        } else {
          console.log("Not connected to SendBird or no current user.")
        }
      } catch (error) {
        console.error("Error during push token deregistration:", error)
        throw error // Rethrow if needed for additional error handling
      }
    }),

    registerDeviceToken: flow(function* () {
      const chatStore = getRoot(self).chatStore // Ensure you have access to the Sendbird instance
      //TODO and then logout
      yield chatStore.connect(userID, "Damini Rijhwani Andnroid", accessToken)

      // Request permission for notifications, crucial for iOS
      const requestPermission = flow(function* () {
        const authStatus = yield messaging().requestPermission()
        const enabled =
          authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
          authStatus === messaging.AuthorizationStatus.PROVISIONAL
        return enabled
      })

      try {
        let token
        if (Platform.OS === "ios") {
          const hasPermission = yield requestPermission()
          if (hasPermission) {
            token = yield messaging().getAPNSToken()
            if (token) {
              console.log("Token to be registered:", token)
              yield chatStore.sdk.registerAPNSPushTokenForCurrentUser(token)
              console.log("APNS token registered successfully")
            } else {
              console.error("Failed to get APNS token")
            }
          } else {
            console.error("Notification permission is not granted")
          }
        } else {
          // Assuming Android by default
          token = yield messaging().getToken()
          if (token) {
            console.log("Token to be registered:", token)
            yield chatStore.sdk.registerFCMPushTokenForCurrentUser(token)
            console.log("FCM token registered successfully")
          } else {
            console.error("Failed to get FCM token")
          }
        }

        // Handle token refresh
        messaging().onTokenRefresh((newToken) => {
          registerDeviceToken(newToken) // Call this function recursively to update the token
        })
      } catch (error) {
        console.error("Error during push token registration:", error)
        throw error // Optionally, handle this error more gracefully
      }
    }),
    checkCognitoUserSession: flow(function* () {
      self.setLoading(true)
      self.setSDKConnected(false)
      const mongoDBStore = getRoot(self).mongoDBStore
      const chatStore = getRoot(self).chatStore
      const userStore = getRoot(self).userStore

      try {
        const userPool = new CognitoUserPool(poolData)
         yield self.checkUserSession(userPool, userStore)

        console.log("User is signed in")
        self.setIsAuthenticated(true)

        yield chatStore.initializeSDK()
        yield chatStore.connect(userStore._id, "Damini Rijhwani Android", userStore.accessToken)
        console.log("User connected to SendBird")

        // Reset or initialize any necessary state
        resetToInitialState()
        mongoDBStore.shouldQuery()
        self.setSDKConnected(true)
      } catch (error) {
        console.error(error)
        self.clearUserSession()
        self.setIsAuthenticated(false)
      } finally {
        self.setLoading(false)
      }
    }),
    setIsAuthenticated(isAuthenticated: Boolean) {
      self.isAuthenticated = isAuthenticated
    },
    signUp: flow(function* () {
      const userStore = getRoot(self).userStore

      try {
        const attributeList = [
          new CognitoUserAttribute({ Name: "email", Value: userStore.email }),
          new CognitoUserAttribute({ Name: "phone_number", Value: userStore.phoneNumber }),
          new CognitoUserAttribute({ Name: "gender", Value: userStore.gender }),
        ]

        yield new Promise((resolve, reject) => {
          userPool.signUp(
            userStore.phoneNumber,
            userStore.authPassword,
            attributeList,
            null,
            (err, result) => {
              if (err) {
                reject(err)
              } else {
                userStore.setID(result?.userSub)
                resolve(result)
              }
            },
          )
        })

        return { success: true }
      } catch (error) {
        console.error("Error during the sign-up process:", error)
        throw error
      }
    }),
    authenticateUser: flow(function* (username, password) {
      const userStore = getRoot(self).userStore
      const authenticationData = {
        Username: username,
        Password: password,
      }
      const authenticationDetails = new AuthenticationDetails(authenticationData)

      const userData = {
        Username: username,
        Pool: userPool,
      }
      const cognitoUser = new CognitoUser(userData)

      try {
        const result = yield new Promise((resolve, reject) => {
          cognitoUser.authenticateUser(authenticationDetails, {
            onSuccess: (session) => {
              console.log("Authentication successful:", session)

              // You can now use the session object to get tokens or perform further actions
              const idToken = session.getIdToken().getJwtToken()
              const accessToken = session.getAccessToken().getJwtToken()
              const refreshToken = session.getRefreshToken().getToken()

              // Optionally, you can save these tokens to your user store or state management
              //userStore.setTokens({ idToken, accessToken, refreshToken })
              const userSub = session.getIdToken().payload.sub
              userStore.setID(userSub)
              resolve(session)
            },
            onFailure: (err) => {
              console.error("Authentication failed:", err)
              reject(err)
            },
          })
        })

        // Handle successful authentication
        // Perform any additional actions after authentication here, such as initializing SDKs or connecting to other services
        console.log("Authentication successful, tokens set in user store")
      } catch (error) {
        // Handle authentication failure
        console.error("Authentication failed:", error)
        throw error // Or handle it as needed within your app
      }
    }),
    sendConfirmationCode: flow(function* sendConfirmationCode(phoneNumber, password) {
      // Assuming userPool is already defined and accessible
      const userStore = getRoot(self).userStore
      const cognitoUser = new CognitoUser({
        Username: userStore.phoneNumber,
        Pool: userPool,
      })
      cognitoUser.resendConfirmationCode(function (err, result) {
        if (err) {
          alert(err.message || JSON.stringify(err))
          return
        }
        console.log("call result: " + result)
      })
    }),
    confirmRegistration: flow(function* () {
      const userStore = getRoot(self).userStore
      const mongoDBStore = getRoot(self).mongoDBStore
      const cognitoUser = new CognitoUser({
        Username: userStore.phoneNumber,
        Pool: userPool,
      })

      try {
        const confirmationResult = yield new Promise((resolve, reject) => {
          cognitoUser.confirmRegistration(self.verificationPhoneCode, true, (err, result) => {
            if (err) {
              reject(new Error(err.message || "Confirmation failed"))
            } else {
              resolve(result)
            }
          })
        })

        console.log("Confirmation successful:", confirmationResult)

        // Proceed with MongoDB user creation
        yield mongoDBStore.createUserInMongoDB()
        yield self.configureMongoDBAfterSignup()

        // Authenticate the user after confirmation
        yield self.authenticateUser(userStore.phoneNumber, userStore.authPassword)

        return
      } catch (error) {
        console.error(
          "An error occurred during the confirmation or MongoDB user creation process:",
          error.message || error,
        )
        throw error
      }
    }),
    setVerificationPhoneCode(code: number) {
      self.verificationPhoneCode = code
    },

    setAuthEmail(value: string) {
      //self.user?.email = value.replace(/ /g, "")
    },
    signIn: flow(function* signIn() {
      const userStore = getRoot(self).userStore
      const mongoDBStore = getRoot(self).mongoDBStore
      const chatStore = getRoot(self).chatStore

      try {
        const authData = {
          Username: userStore.phoneNumber,
          Password: userStore.authPassword,
        }
        const authDetails = new AuthenticationDetails(authData)
        const userData = {
          Username: userStore.phoneNumber,
          Pool: userPool,
        }
        const cognitoUser = new CognitoUser(userData)

        yield new Promise((resolve, reject) => {
          cognitoUser.authenticateUser(authDetails, {
            onSuccess: async (session) => {
              console.log("Authentication successful:", session)

              // Set user session
              await self.setUserSession(session)

              try {
                // Handle post-authentication actions
                await self.handlePostAuthenticationActions()
                resolve(session)
              } catch (postAuthError) {
                reject(postAuthError)
              }
            },
            onFailure: (err) => {
              console.error("Error signing in:", err)
              self.setError(err.message || "Error signing in")
              self.signOut()
              reject(err)
            },
          })
        })
      } catch (error) {
        console.error("Error signing in:", error)
        self.setError(error.message || "Error signing in")
      }
    }),
    forgotPassword: flow(function* forgotPassword(phoneNumber) {
      try {
        const userData = {
          Username: phoneNumber,
          Pool: userPool,
        }
        const cognitoUser = new CognitoUser(userData)
        yield new Promise((resolve, reject) => {
          cognitoUser.forgotPassword({
            onSuccess: (result) => {
              self.setError(null)
              resolve(result)
            },
            onFailure: (err) => {
              console.error("Error initiating forgot password:", err)
              self.setError(err.message || "Error initiating forgot password")
              reject(err)
            },
          })
        })
      } catch (error) {
        console.error("Error initiating forgot password:", error)
        self.setError(error.message || "Error initiating forgot password")
      }
    }),
    signOut: flow(function* signOut() {
      const cognitoUser = userPool.getCurrentUser()
      const chatStore = getRoot(self).chatStore // Ensure you
      if (cognitoUser != null) {
        try {
          cognitoUser.signOut()
          self.setIsAuthenticated(false)
          // Optional: Clear any user data from your application state
          // Perform any additional cleanup or redirection as needed
          // remove push notification if logged out as well
          yield self.unregisterPushNotifications()
          yield chatStore.disconnect()
          yield removeStore()
          yield storage.clearAll()
        } catch (error) {
          console.error("An error occurred during sign out:", error)
          // Handle the sign-out error (e.g., display a notification to the user)
        }
      } else {
        console.log("No user is currently signed in.")
        self.setIsAuthenticated(false)
        // Optionally, handle the case when no user is signed in (e.g., redirect to sign-in page)
      }
    }),

    setUser(user: SnapshotOut<typeof UserModel> | null) {
      self.user = user ? { ...user } : null
    },

    setError(error: string | null) {
      self.error = error
    },
  }))
  .actions((self) => ({
    afterCreate() {
      self.checkCognitoUserSession()
    },
  }))

export interface UserStoreModel extends Instance<typeof UserStoreModel> {}
export interface UserStoreSnapshot extends SnapshotOut<typeof UserStoreModel> {}
export interface AuthenticationStore extends Instance<typeof AuthenticationStoreModel> {}
export interface AuthenticationStoreSnapshot extends SnapshotOut<typeof AuthenticationStoreModel> {}

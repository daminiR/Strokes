import {Alert, Platform} from 'react-native';
import {ApolloClient, InMemoryCache} from "@apollo/client";
import {
  CognitoUser,
  CognitoUserAttribute,
  AuthenticationDetails,
  CognitoUserPool,
} from "amazon-cognito-identity-js"
import {flow, process, types} from 'mobx-state-tree';
//import {setContext} from '@apollo/client/link/context';
import * as Keychain from 'react-native-keychain'
import messaging from "@react-native-firebase/messaging"

import storage from "app/utils/storage/mmkvStorage"
import {createAuthenticatedClient} from 'app/services/api/apollo-client';
import {getRootStore} from "./helpers/getRootStore"
import {removeStore} from "./helpers/removeRootStore"
import {resetToInitialState} from "./../navigators"
import {withSetPropAction} from "./helpers/withSetPropAction"

export const storePasswordSecurely = async (username: string, password: string, authenticationStore: any) => {
  try {
    // Check if the password was recently updated
    if (authenticationStore.isPasswordRecentlyUpdated) {
      console.log("Password was recently updated. Storing directly with Face ID.");
      // Reset the flag and store the password directly
      await Keychain.setGenericPassword(username, password, {
        accessControl: Keychain.ACCESS_CONTROL.BIOMETRY_ANY,
        accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
      });
      authenticationStore.setProp("isPasswordRecentlyUpdated", false); // Reset the flag after storing
      console.log("Password stored securely with Face ID after recent update.");
      return;
    } else {
      // Check if credentials already exist
      const credentials = await Keychain.getGenericPassword();

      if (credentials) {
        const storedUsername = credentials.username;
        const storedPassword = credentials.password;

        // If both username and password match, no need to update
        if (storedUsername === username && storedPassword === password) {
          console.log("The stored credentials match the new ones. No update needed.");
        } else {
          // Prompt the user to update the stored credentials
          Alert.alert(
            "Update Password",
            "The stored username or password doesn't match. Do you want to update the stored password?",
            [
              {
                text: "Cancel",
                onPress: () => console.log("Password update cancelled"),
                style: "cancel",
              },
              {
                text: "Update",
                onPress: async () => {
                  // Update the password in Keychain
                  await Keychain.setGenericPassword(username, password, {
                    accessControl: Keychain.ACCESS_CONTROL.BIOMETRY_ANY,
                    accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
                  });
                  console.log("Password updated successfully.");
                },
              },
            ],
            {cancelable: false}
          );
        }
      } else {
        // No credentials exist, store the password for the first time
        await Keychain.setGenericPassword(username, password, {
          accessControl: Keychain.ACCESS_CONTROL.BIOMETRY_ANY,
          accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
        });
        console.log("Password stored successfully for the first time.");
      }
    }
  } catch (error) {
    console.error("Error storing or updating password:", error);
  }
};

async function requestUserPermission() {
  const authorizationStatus = await messaging().requestPermission()
  return (
    authorizationStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authorizationStatus === messaging.AuthorizationStatus.PROVISIONAL
  )
}

if (Platform.OS === "ios") {
  requestUserPermission().then((hasPermission) => {
    if (hasPermission) {
      // Continue with getting the token and registering it...
    }
  })
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
}
const TokenType = types.model("TokenType", {
  idToken: types.string,
  accessToken: types.string,
  refreshToken: types.string,
})
const userPool = new CognitoUserPool(poolData)
//Define the AuthStore model
export const AuthenticationStoreModel = types
  .model("AuthenticationStoreModel")
  .props({
    tokens: types.maybeNull(TokenType),
    apolloClient: types.maybeNull(types.frozen<ApolloClient<any>>()),
    isSDKConnected: types.optional(types.boolean, false),
    isPasswordRecentlyUpdated: types.optional(types.boolean, false),
    isLoading: types.maybeNull(types.boolean),
    isRefreshing: types.maybeNull(types.boolean),
    isAuthenticated: types.optional(types.boolean, false),
    verificationPhoneCode: types.maybeNull(types.string),
    error: types.maybeNull(types.string),
  })
  .volatile(self => ({
    userStore: null, // Initialize as null and set in afterCreate
    chatStore: null, // Initialize as null and set in afterCreate
    mongoDBStore: null,
    matchStore: null,
    likedUserStore: null,
    matchedProfileStore: null,
  }))
  .actions(withSetPropAction)
  .actions((self) => ({
    afterAttach() {
      self.userStore = getRootStore(self).userStore;
      self.chatStore = getRootStore(self).chatStore;
      self.mongoDBStore = getRootStore(self).mongoDBStore;
      self.matchStore = getRootStore(self).matchStore
      self.likedUserStore = getRootStore(self).likedUserStore // Assuming there's a store for liked profiles
      self.matchedProfileStore = getRootStore(self).matchedProfileStore // Assuming there's a store for liked profiles
    },
  }))
  .actions((self) => {
    type SelfType = typeof self
    const setVerificationPhoneCode = (code: number) => {
      self.verificationPhoneCode = code
    }
    const setApolloClient = (client: ApolloClient<any>) => {
      self.apolloClient = client; // This is a regular MST action
    }
    const resetPassword = flow(function* resetPassword(newPassword: string) {
      try {
        const userPool = new CognitoUserPool(poolData);
        const cognitoUser = new CognitoUser({
          Username: self.userStore.phoneNumber,
          Pool: userPool,
        })
        yield new Promise((resolve, reject) => {
          cognitoUser.confirmPassword(self.verificationPhoneCode, newPassword, {
            onSuccess: (result) => {
              console.log("Password reset successful:", result)
              self.userStore.setAuthPassword("")
              self.setProp("error", null) // Clear any previous error
              resolve(result)
            },
            onFailure: (err) => {
              console.error("Error resetting password:", err)
              self.setProp("error", err.message || "Error resetting password")
              reject(err)
            },
          })
        })
      } catch (error) {
        console.error("Error resetting password:", error)
        self.setProp("error", error.message || "Error resetting password")
      }
    })
    const sendPasswordResetRequest = flow(function* sendPasswordResetRequest(phoneNumberOrEmail: string) {
      try {
        const userPool = new CognitoUserPool(poolData);
        const cognitoUser = new CognitoUser({
          Username: self.userStore.phoneNumber,
          Pool: userPool,
        })

        yield new Promise((resolve, reject) => {
          cognitoUser.forgotPassword({
            onSuccess: (result) => {
              console.log("Password reset request initiated:", result)
              self.setProp("error", null) // Clear any previous error
              resolve(result)
            },
            onFailure: (err) => {
              console.error("Error initiating password reset request:", err)
              self.setProp("error", err.message || "Error initiating password reset request")
              reject(err)
            },
          })
        })
      } catch (error) {
        console.error("Error initiating password reset request:", error)
        self.setProp("error", error.message || "Error initiating password reset request")
      }
    })
    const syncUserPoolStorage = flow(function* (userPool) {
      return new Promise((resolve, reject) => {
        userPool.storage.sync((err: any, result: any) => {
          if (err) {
            reject(err)
          } else if (result === "SUCCESS") {
            resolve(userPool.getCurrentUser())
          } else {
            reject(new Error("Storage sync failed"))
          }
        })
      })
    })
    const setUserSession = flow(function* (session) {
      const idToken = session.getIdToken().getJwtToken()
      const accessToken = session.getAccessToken().getJwtToken()
      const refreshToken = session.getRefreshToken().getToken()
      const userSub = session.getIdToken().payload.sub

      self.setProp("tokens", {idToken, accessToken, refreshToken})
      self.userStore.setID(userSub)
    })
    const checkUserSession = flow(function* checkUserSession(userPool) {
      const cognitoUser = yield syncUserPoolStorage(userPool)
      if (cognitoUser == null) {
        console.log("No current Cognito user")
        return null
      }
      const session = yield new Promise((resolve, reject) => {
        cognitoUser.getSession((err: any, session: any) => {
          if (err || !session.isValid()) {
            console.log("Session is invalid or could not be retrieved")
            resolve(null)
          } else {
            resolve(session)
          }
        })
      })

      if (session) {
        yield setUserSession(session)
      }

      return session
    })
    const setupChat = flow(function* setupChat() {
      const userSub = self.userStore._id;
      try {
        // Step 1: Initialize the Sendbird SDK
        yield self.chatStore.initializeSDK();

        // Step 2: Connect the user to the Sendbird chat service
        yield self.chatStore.connect(userSub, self.userStore.firstName, self.userStore.accessToken);
        self.setProp("isSDKConnected", true);
        console.log("Chat SDK initialized and connected.");

        // Step 3: Register the device token for push notifications
        yield self.registerDeviceToken();
        console.log("Registered for push notifications.");

      } catch (error) {
        console.error("Error during chat setup:", error);
        self.setProp("error", error.message || "Error during chat setup.");
        throw error; // Ensure the error propagates
      }
    })
    const handlePostAuthenticationActions = flow(function* () {
      try {
        const userSub = self.userStore._id
        yield self.mongoDBStore.queryUserFromMongoDB(userSub)
        yield self.mongoDBStore.queryPotentialMatches()
        yield self.setupChat()
        console.log("Registered for push notifications")
        self.setProp("isAuthenticated", true)
      } catch (error) {
        console.error("Error during post-authentication actions:", error)
        self.setProp("error", error.message || "Error during post-authentication actions")
        signOut()
        throw error
      }
    })
    const handleSessionExpiration = flow(function* handleSessionExpiration() {
      try {
        // Clear any local session data
        yield clearUserSession();

        // Disconnect from SendBird
        yield self.chatStore.disconnect();

        // Optionally, reset any MongoDB state if necessary
        resetToInitialState();

        // Set authentication state to false
        self.setProp("isAuthenticated", false);
        self.setProp("isSDKConnected", false);

        console.log("User has been logged out and session cleared.");
      } catch (error) {
        console.error("Error handling session expiration:", error);
      }
    })
    const clearUserSession = flow(function* clearUserSession() {
      self.setProp("isAuthenticated", false)
      yield removeStore()
      yield storage.clearAll()
    })
    const unregisterPushNotifications = flow(function* () {
      const chatStore = getRootStore(self).chatStore // Ensure you have access to the Sendbird instance
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
    })
    const registerDeviceToken = flow(function* () {
      const chatStore = getRootStore(self).chatStore // Ensure you have access to the Sendbird instance
      const userStore = getRootStore(self).userStore // Ensure you have access to the Sendbird instance
      //TODO and then logout
      yield chatStore.connect(userStore._id, userStore.firstName, userStore.accessToken)

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
        messaging().onTokenRefresh(async (newToken) => {
          //registerDeviceToken(newToken) // Call this function recursively to update the token
          await registerDeviceToken() // Call this function recursively to update the token
        })
      } catch (error) {
        console.error("Error during push token registration:", error)
        throw error // Optionally, handle this error more gracefully
      }
    })
    const checkCognitoUserSession = flow(function* checkCognitoUserSession(includeMongoDBQueryReset = true) {
      self.setProp("isRefreshing", true);
      self.setProp("isSDKConnected", false);

      try {
        // Initialize Cognito User Pool and check the session
        const userPool = new CognitoUserPool(poolData);
        const session = yield checkUserSession(userPool);  // This function checks if the session is still valid

        // If session exists and is valid
        if (session) {
          const idToken = session.getIdToken().getJwtToken();
          console.log("Session is valid, user is signed in.");

          // Recreate Apollo Client with the authenticated token if needed
          self.setApolloClient(createAuthenticatedClient(idToken));
          self.setProp("isAuthenticated", true);

          // Initialize or reconnect SendBird SDK only if necessary
          if (!self.isSDKConnected) {
            yield self.chatStore.initializeSDK();
            console.log("SendBird SDK initialized and connected.");
            self.setProp("isSDKConnected", true);
          }

          // Only re-fetch data or reset MongoDB state if required (e.g., after a certain period or if data is stale)
          if (includeMongoDBQueryReset) {
            resetToInitialState();  // Optionally reset the state if needed
            yield self.handlePostAuthenticationActions();  // Handle any post-authentication actions like fetching data
            yield self.mongoDBStore.fetchMatchInteractionData();  // Fetch interaction data if needed
          }

        } else {
          // Session doesn't exist or is invalid, log out the user
          console.log("No valid session found, logging out.");
          yield self.handleSessionExpiration();
        }

      } catch (error) {
        // Handle session or connection errors, log out if necessary
        console.error("Error during session check:", error);
        yield self.handleSessionExpiration();
      } finally {
        self.setProp("isRefreshing", false);
      }
    })
    const signUp = flow(function* () {
      const userStore = getRootStore(self).userStore

      try {
        const attributeList = [
          new CognitoUserAttribute({Name: "email", Value: userStore.email}),
          new CognitoUserAttribute({Name: "phone_number", Value: userStore.phoneNumber}),
          new CognitoUserAttribute({Name: "gender", Value: userStore.gender}),
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

        return {success: true}
      } catch (error) {
        console.error("Error during the sign-up process:", error)
        throw error
      }
    })
    const authenticateUser = flow(function* (username, password) {
      const userStore = getRootStore(self).userStore
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
              self.setProp("tokens", {idToken, accessToken, refreshToken})
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
    })
    const sendConfirmationCode = flow(function* sendConfirmationCode(phoneNumber, password) {
      // Assuming userPool is already defined and accessible
      const userStore = getRootStore(self).userStore
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
    })
    const confirmRegistration = flow(function* () {
      const userStore = getRootStore(self).userStore
      const mongoDBStore = getRootStore(self).mongoDBStore
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
    })
    const signIn = flow(function* signIn(apolloClient) {
      try {
        const authData = {
          Username: self.userStore.phoneNumber,
          Password: self.userStore.authPassword,
        };
        const authDetails = new AuthenticationDetails(authData);
        const userData = {
          Username: self.userStore.phoneNumber,
          Pool: userPool,
        };
        const cognitoUser = new CognitoUser(userData);

        yield new Promise((resolve, reject) => {
          cognitoUser.authenticateUser(authDetails, {
            onSuccess: async (session) => {
              console.log("Authentication successful:", session);

              // Extract the idToken from the session
              const idToken = session.getIdToken().getJwtToken();

              // Set user session
              await self.setUserSession(session);

              // Update Apollo Client with the authenticated token
              self.setApolloClient(createAuthenticatedClient(idToken));

              try {
                // Check and store password securely with Face ID prompt
                await storePasswordSecurely(self.userStore.phoneNumber, self.userStore.authPassword, self);

                // Handle post-authentication actions
                await self.handlePostAuthenticationActions();

                // Ensure MongoDB queries use the token for authentication
                await self.mongoDBStore.fetchMatchInteractionData();

                resolve(session);
              } catch (postAuthError) {
                reject(postAuthError);
              }
            },
            onFailure: (error) => {
              console.error("Error signing in:", error);
              self.setProp("error", error.message || "Error signing in");
              self.signOut();
              reject(error);
            },
          });
        });
      } catch (error) {
        console.error("Error signing in:", error);
        self.setProp("error", error.message || "Error signing in");
      }
    })
    const forgotPassword = flow(function* forgotPassword(phoneNumber) {
      try {
        const userData = {
          Username: phoneNumber,
          Pool: userPool,
        }
        const cognitoUser = new CognitoUser(userData)
        yield new Promise((resolve, reject) => {
          cognitoUser.forgotPassword({
            onSuccess: (result) => {
              self.setProp("error", null)
              resolve(result)
            },
            onFailure: (error: any) => {
              console.error("Error initiating forgot password:", err)
              self.setProp("error", error.message || "Error initiating forgot password")
              reject(error)
            },
          })
        })
      } catch (error) {
        console.error("Error initiating forgot password:", error)
        self.setProp("error", error.message || "Error initiating forgot password")
      }
    })
    const cleanupActions = flow(function* cleanupActions() {
      const chatStore = getRootStore(self).chatStore
      try {
        self.unregisterPushNotifications()
        yield chatStore.disconnect()
        yield removeStore()
        yield storage.clearAll()
        //yield new Promise((resolve) => {
        //storage.clearAll(() => {
        //resolve()
        //})
        //})
      } catch (error) {
        console.error("An error occurred during cleanup actions:", error)
      }
    })
    const cognitoUserSignOut = flow(function* cognitoUserSignOut() {
      const userPool = new CognitoUserPool(poolData)
      const cognitoUser = userPool.getCurrentUser()
      if (cognitoUser != null) {
        cognitoUser.signOut()
      }
    })
    const signOut = flow(function* () {
      self.setProp("isLoading", true)
      const userPool = new CognitoUserPool(poolData)
      try {
        yield self.cognitoUserSignOut()
        self.setProp("isAuthenticated", false)
        yield self.cleanupActions()
      } catch (error) {
        console.error("An error occurred during sign out:", error)
        // Handle the sign-out error (e.g., display a notification to the user)
      } finally {
        self.setProp("isLoading", false)
      }
    })
    return {
      syncUserPoolStorage,
      setUserSession,
      checkUserSession,
      handlePostAuthenticationActions,
      clearUserSession,
      unregisterPushNotifications,
      registerDeviceToken,
      checkCognitoUserSession,
      sendPasswordResetRequest,
      resetPassword,
      signUp,
      authenticateUser,
      sendConfirmationCode,
      confirmRegistration,
      signIn,
      forgotPassword,
      cleanupActions,
      cognitoUserSignOut,
      setVerificationPhoneCode,
      setApolloClient,
      signOut,
      handleSessionExpiration,
      setupChat,
    }
  })
  .actions((self) => ({
    afterCreate() {
      self.checkCognitoUserSession()
    },
  }))


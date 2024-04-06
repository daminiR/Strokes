import { types, flow, cast, SnapshotOrInstance, SnapshotOut, Instance, getRoot} from 'mobx-state-tree';
import { CognitoUser, CognitoUserAttribute, AuthenticationDetails, CognitoUserPool } from 'amazon-cognito-identity-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserStoreModel } from "./UserStore"
import { getRootStore } from "./helpers/getRootStore"
import { removeStore } from "./helpers/removeRootStore"

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
const userPool = new CognitoUserPool(poolData);
 //Define the AuthStore model
export const AuthenticationStoreModel = types
  .model("AuthenticationStoreModel", {
    user: types.maybeNull(UserStoreModel),
    isLoading: types.maybeNull(types.boolean),
    isAuthenticated: types.maybeNull(types.boolean),
    verificationPhoneCode: types.maybeNull(types.string),
    error: types.maybeNull(types.string),
  })
  .actions((self) => ({
    checkCognitoUserSession() {
      const mongoDBStore = getRoot(self).mongoDBStore
      var userPool = new CognitoUserPool(poolData);
            userPool.storage.sync(function (err, result) {
              if (err) {
                console.error("Error syncing storage:", err)
                self.setIsAuthenticated(false)
              } else if (result === "SUCCESS") {
                var cognitoUser = userPool.getCurrentUser()
                if (cognitoUser != null) {
                  cognitoUser.getSession(function (err, session) {
                    if (err) {
                      console.error(err)
                      self.setIsAuthenticated(false)
                      return
                    }
                    if (session.isValid()) {
                      console.log("User is signed in")
                      self.setIsAuthenticated(true)
                      mongoDBStore.queryPotentialMatches()


                    } else {
                      console.log("Session is invalid")
                      self.setIsAuthenticated(false)
                    }
                  })
                } else {
                  console.log("No current Cognito user")
                  self.setIsAuthenticated(false)
                }
              }
            })
    },
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
        const signUpResult = yield new Promise((resolve, reject) => {
          userPool.signUp(
            userStore.phoneNumber,
            userStore.authPassword,
            attributeList,
            null,
            async (err, result) => {
              if (err) {
                if (err.code === "UsernameExistsException") {
                  // Instantiate CognitoUser and AuthenticationDetails
                  const cognitoUser = new CognitoUser({
                    Username: userStore.phoneNumber,
                    Pool: userPool,
                  })
                  const authenticationDetails = new AuthenticationDetails({
                    Username: userStore.phoneNumber,
                    Password: userStore.authPassword,
                  })

                  // Attempt to authenticate the user
                  cognitoUser.authenticateUser(authenticationDetails, {
                    onSuccess: (authResult) => {
                      // User is authenticated, check if they are confirmed
                      cognitoUser.getUserData((userDataErr, userData) => {
                        if (userDataErr) {
                          reject(userDataErr)
                        } else {
                          const isConfirmed = userData.UserStatus === "CONFIRMED"
                          reject(err)
                          //resolve({ userConfirmed: isConfirmed, userData })
                        }
                      })
                    },
                    onFailure: (authErr) => {
                      // Authentication failed, handle accordingly
                      reject(authErr)
                    },
                  })
                } else {
                  reject(err)
                }
              } else {
                userStore.setID(result?.userSub)
                resolve({ userConfirmed: true, result })
              }
            },
          )
        })
      } catch (error) {
        // Handle error
        console.error("Error during the signUp process:", error)
        throw error
        // Optionally set error state or navigate based on error type
      }
    }),
    authenticateUser: flow(function* (username, password) {
      const userStore = getRootStore(self).userStore
      const authenticationData = {
        Username: userStore.phoneNumber,
        Password: userStore.password,
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
            onSuccess: (result) => {
              //AWS.config.region = "" // Specify the AWS region

              AWS.config.credentials = new AWS.CognitoIdentityCredentials({
                IdentityPoolId: process.env.REACT_APP_USER_POOL_ID3,
                Logins: {
                  [`cognito-idp.<region>.amazonaws.com/${poolData.UserPoolId}`]: result
                    .getIdToken()
                    .getJwtToken(),
                },
              })

              AWS.config.credentials.refresh((error) => {
                if (error) {
                  reject(error)
                } else {
                  // Success, AWS SDK can be used
                  resolve(result)
                }
              })
            },
            onFailure: (err) => {
              reject(err)
            },
          })
        })

        // Handle successful authentication
        console.log("Authentication successful:", result)
        // Update store state as necessary
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

      var userData = {
        Username: userStore.phoneNumber,
        Pool: userPool, // Ensure userPool is defined and accessible
      }
      var cognitoUser = new CognitoUser(userData)

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
        console.log("usersub", cognitoUser)

        console.log("Confirmation successful:", confirmationResult)

        // If confirmation is successful, proceed with MongoDB user creation
        const mongoResult = yield mongoDBStore.createUserInMongoDB(userStore.userData) // Ensure you're passing the correct data
        // set authentication to true
        self.setIsAuthenticated(true)
        return mongoResult // Return MongoDB result or confirmation result as needed
      } catch (error) {
        console.error(
          "An error occurred during the confirmation or MongoDB user creation process:",
          error.message || error,
        )
        throw error // Rethrow the error to be caught by the verify function
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
        yield new Promise( (resolve, reject) => {
          cognitoUser.authenticateUser(authDetails, {
            onSuccess: async (result) => {
              console.log(result)
              const userSub = result.idToken.payload.sub;
              userStore.setID(userSub)
              await mongoDBStore.queryUserFromMongoDB(userSub)
              self.setIsAuthenticated(true)
              // mongodb hydrate userstore hydrate
              //self.setUser(cognitoUser)
              //self.setError(null)
              resolve(result)
            },
            onFailure: (err) => {
              console.error("Error signing in:", err)
              self.setError(err.message || "Error signing in")
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
      if (cognitoUser != null) {
        try {
          cognitoUser.signOut()
          self.setIsAuthenticated(false)
          // Optional: Clear any user data from your application state
          // Perform any additional cleanup or redirection as needed
          yield removeStore()
          yield AsyncStorage.clear()
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
  .actions(self => ({
    afterCreate() {
      self.checkCognitoUserSession();
    },
  }))

export interface UserStoreModel extends Instance<typeof UserStoreModel> {}
export interface UserStoreSnapshot extends SnapshotOut<typeof UserStoreModel> {}
export interface AuthenticationStore extends Instance<typeof AuthenticationStoreModel> {}
export interface AuthenticationStoreSnapshot extends SnapshotOut<typeof AuthenticationStoreModel> {}

import { types, flow, cast, SnapshotOrInstance, SnapshotOut, Instance, getRoot} from 'mobx-state-tree';
import { CognitoUser, CognitoUserAttribute, AuthenticationDetails, CognitoUserPool } from 'amazon-cognito-identity-js';
//import MongoDBStore from './MongoDBStore';
import { getRootStore } from './helpers/getRootStore';

const ImageDataModel = types.model({
  imageURL: types.maybeNull(types.string),
  img_idx: types.integer,
  filePath: types.maybeNull(types.string),
});

// Define a model for User
export const UserStoreModel = types
  .model("UserStoreModel", {
    _id: types.maybeNull(types.string), // Assuming you're providing a unique identifier when creating a user instance
    authPassword: types.maybeNull(types.string),
    phoneNumber: types.maybeNull(types.string),
    email: types.maybeNull(types.string),
    imageFiles: types.optional(types.array(ImageDataModel), []),
    gender: types.optional(types.enumeration("Gender", ["male", "female", "other"]), "other"),
    description: types.maybeNull(types.string),
    firstName: types.maybeNull(types.string),
    lastName: types.maybeNull(types.string),
    neighborhood: types.maybeNull(types.string),
  })
  .actions((self) => ({
    setEmail(email: string) {
      self.email = email
    },
    setPhoneNumber(phoneNumber: string) {
      self.phoneNumber = phoneNumber
    },
    setAuthPassword(password: string) {
      self.authPassword = password
    },
    setFirstName(firstName: string) {
      self.firstName = firstName
    },
    setLastName(lastName: string) {
      self.lastName = lastName
    },
    setGender(gender: string) {
      self.gender = gender
    },
    setImageFiles(imageFiles: SnapshotOrInstance<typeof ImageDataModel>[]) {
      self.imageFiles = cast(imageFiles)
    },
    setNeighborhood(neighborhood: string) {
      self.neighborhood = neighborhood
    },
    setDescription(description: string) {
      self.description = description
    },
    setID(_id: string) {
      self._id = _id
    },
    reset() {
      self._id = ""
      //self.authPassword = ""
      //self.firstName = ""
      //self.lastName = ""
      //self.gender = ""
      //self.neighborhood = ""
      //self.description = ""
    },
    // Add other actions as needed
  }))
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
    verificationPhoneCode: types.maybeNull(types.string),
    error: types.maybeNull(types.string),
  })
  .actions((self) => ({
    signUp: flow(function* signUp() {
      const userStore = getRootStore(self).userStore
      console.log(process.env.REACT_APP_USER_POOL_ID3)
      try {
        const attributeList = [
          new CognitoUserAttribute({ Name: "email", Value: userStore.email }),
          new CognitoUserAttribute({ Name: "phone_number", Value: userStore.phoneNumber }),
          new CognitoUserAttribute({ Name: "gender", Value: userStore.gender }),
        ]
        // Convert userPool.signUp to a Promise that can be used with yield
        const signUpResult = yield new Promise((resolve, reject) => {
          userPool.signUp(
            userStore.phoneNumber,
            userStore.authPassword,
            attributeList,
            [],
            (err: unknown, result: unknown) => {
              if (err) {
                console.error("Error signing up:", err)
                reject(err)
              } else {
                //set id
                console.log("User authorized")
                resolve(result)
              }
            },
          )
        })
        userStore.setID(signUpResult.userSub)
        yield self.sendConfirmationCode()
        try {
          //const mongoDBStore = getRootStore(self).mongoDBStore
          //const mongoDBResponse = yield mongoDBStore.createUserInMongoDB()
          //console.log("User created in MongoDB:", mongoDBResponse)
          //self.setUser(signUpResult.user)
          //self.setError(null)
        } catch (mongoErr) {
          console.error("Error creating user in MongoDB:", mongoErr)
          // Handle MongoDB creation error
          //self.setError(mongoErr.message || 'Error creating user in MongoDB');
          // Clean-up logic if needed...
          //yield self.deleteCognitoUser(signUpData.phoneNumber);
          throw mongoErr
        }
      } catch (error) {
        //console.error('Error during the sign-up process:', error);
        //self.setError(error.message || 'Error during the sign-up process');
        // Handle error, potentially cleanup
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
              AWS.config.region = "<region>" // Specify the AWS region

              AWS.config.credentials = new AWS.CognitoIdentityCredentials({
                IdentityPoolId: "YOUR_IDENTITY_POOL_ID", // Your identity pool id here
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
    sendConfirmationCode: flow(function* sendConfirmationCode() {
      const userStore = getRootStore(self).userStore
      yield self.authenticateUser()
      const cognitoUser = new CognitoUser({
        Username: userStore.phoneNumber,
        Pool: userPool,
      })

      try {
        yield new Promise((resolve, reject) => {
          cognitoUser.getAttributeVerificationCode("email", {
            onSuccess() {
              console.log("Verification code sent successfully.")
              resolve({})
            },
            onFailure(err) {
              console.error("Failed to send verification code:", err)
              reject(err)
            },
          })
        })
      } catch (error) {
        console.error("Error sending confirmation code:", error)
        throw error // Or handle it as needed
      }
    }),
    confirmRegistration: flow(function* () {
      const userStore = getRoot(self).userStore
      const mongoDBStore = getRoot(self).mongoDBStore
      // userStore should have the necessary user details

      var userData = {
        Username: userStore.phoneNumber,
        Pool: userPool,
      }
      var cognitoUser = new CognitoUser(userData)

      try {
        const confirmationResult = yield new Promise((resolve, reject) => {
          cognitoUser.confirmRegistration(self.verificationPhoneCode, true, (err, result) => {
            if (err) {
              reject(err)
            } else {
              resolve(result)
            }
          })
        })
        console.log("Confirmation successful:", confirmationResult)

        // Assuming successful confirmation, now create user in MongoDB
        const userDataToSave = {
          username: userStore.username,
          email: userStore.email,
          phoneNumber: userStore.phoneNumber,
          // Add other details as necessary
        }

        const mongoResult = yield mongoDBStore.createUserInMongoDB()
        console.log("User created in MongoDB successfully:", mongoResult)
      } catch (error) {
        console.error(
          "An error occurred during the confirmation or MongoDB user creation process:",
          error,
        )
      }
    }),
    setVerificationPhoneCode(code: number) {
      self.verificationPhoneCode = code
    },

    setAuthEmail(value: string) {
      //self.user?.email = value.replace(/ /g, "")
    },

    signIn: flow(function* signIn(signInData) {
      try {
        const authData = {
          Username: signInData.phoneNumber,
          Password: signInData.password,
        }
        const authDetails = new AuthenticationDetails(authData)
        const userData = {
          Username: signInData.phoneNumber,
          Pool: userPool,
        }
        const cognitoUser = new CognitoUser(userData)
        yield new Promise((resolve, reject) => {
          cognitoUser.authenticateUser(authDetails, {
            onSuccess: (result) => {
              self.setUser(cognitoUser)
              self.setError(null)
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
      try {
        const cognitoUser = userPool.getCurrentUser()
        if (cognitoUser) {
          cognitoUser.signOut()
        }
        self.setUser(null)
        self.setError(null)
      } catch (error) {
        console.error("Error signing out:", error)
      }
    }),

    setUser(user: SnapshotOut<typeof UserModel> | null) {
      self.user = user ? { ...user } : null
    },

    setError(error: string | null) {
      self.error = error
    },
  }))

export interface UserStoreModel extends Instance<typeof UserStoreModel> {}
export interface UserStoreSnapshot extends SnapshotOut<typeof UserStoreModel> {}
export interface AuthenticationStore extends Instance<typeof AuthenticationStoreModel> {}
export interface AuthenticationStoreSnapshot extends SnapshotOut<typeof AuthenticationStoreModel> {}

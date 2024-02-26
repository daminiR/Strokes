import { types, flow, SnapshotOut, Instance} from 'mobx-state-tree';
import { CognitoUser, CognitoUserAttribute, AuthenticationDetails, CognitoUserPool } from 'amazon-cognito-identity-js';

// Define a model for User
export const UserStoreModel = types
  .model('UserStoreModel', {
  id: types.maybeNull(types.string), // Assuming you're providing a unique identifier when creating a user instance
  authPassword: types.maybeNull(types.string),
  phoneNumber:types.maybeNull(types.string),
  email:types.maybeNull(types.string),
  gender: types.optional(types.enumeration('Gender', ['male', 'female', 'other']), 'other'),
  description:types.maybeNull(types.string),
  firstName:types.maybeNull(types.string),
  lastName:types.maybeNull(types.string),
  neighborhood:types.maybeNull(types.string),
}).actions((self) => ({
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
  setNeighborhood(neighborhood: string) {
    self.neighborhood = neighborhood
  },
  setDescription(description: string) {
    self.description = description
  },
  reset() {
    self.email = ""
    self.authPassword = ""
    self.firstName = ""
    self.lastName = ""
    self.gender = ""
    self.neighborhood = ""
    self.description = ""
  },
  // Add other actions as needed
}))

 //Define the AuthStore model
export const AuthenticationStoreModel = types
  .model('AuthenticationStoreModel', {
    user: types.maybeNull(UserStoreModel),
    error: types.maybeNull(types.string),
  })
  .actions((self) => ({
    signUp: flow(function* signUp(signUpData) {
      try {
        const userPool = new CognitoUserPool({
          UserPoolId: process.env.REACT_APP_USER_POOL_ID,
          ClientId: process.env.REACT_APP_APP_CLIENT_ID,
        });
        const attributeList = [
          new CognitoUserAttribute({ Name: 'email', Value: signUpData.email }),
          new CognitoUserAttribute({ Name: 'phone_number', Value: signUpData.phoneNumber }),
          new CognitoUserAttribute({ Name: 'gender', Value: signUpData.gender }),
          new CognitoUserAttribute({ Name: 'custom:description', Value: signUpData.description }),
          new CognitoUserAttribute({ Name: 'given_name', Value: signUpData.firstName }),
          new CognitoUserAttribute({ Name: 'family_name', Value: signUpData.lastName }),
          new CognitoUserAttribute({ Name: 'custom:location', Value: signUpData.location }),
        ];
        yield new Promise((resolve, reject) => {
          userPool.signUp(signUpData.phoneNumber, signUpData.password, attributeList, [], (err, result) => {
            if (err) {
              console.error('Error signing up:', err);
              self.setError(err.message || 'Error signing up');
              reject(err);
            } else {
              self.setUser(result.user);
              self.setError(null);
              resolve(result);
            }
          });
        });
      } catch (error) {
        console.error('Error signing up:', error);
        self.setError(error.message || 'Error signing up');
      }
    }),
    setAuthEmail(value: string) {
      //self.user?.email = value.replace(/ /g, "")
    },

    signIn: flow(function* signIn(signInData) {
      try {
        const userPool = new CognitoUserPool({
          UserPoolId: process.env.REACT_APP_USER_POOL_ID,
          ClientId: process.env.REACT_APP_APP_CLIENT_ID,
        });
        const authData = {
          Username: signInData.phoneNumber,
          Password: signInData.password,
        };
        const authDetails = new AuthenticationDetails(authData);
        const userData = {
          Username: signInData.phoneNumber,
          Pool: userPool,
        };
        const cognitoUser = new CognitoUser(userData);
        yield new Promise((resolve, reject) => {
          cognitoUser.authenticateUser(authDetails, {
            onSuccess: (result) => {
              self.setUser(cognitoUser);
              self.setError(null);
              resolve(result);
            },
            onFailure: (err) => {
              console.error('Error signing in:', err);
              self.setError(err.message || 'Error signing in');
              reject(err);
            },
          });
        });
      } catch (error) {
        console.error('Error signing in:', error);
        self.setError(error.message || 'Error signing in');
      }
    }),

    forgotPassword: flow(function* forgotPassword(phoneNumber) {
      try {
        const userPool = new CognitoUserPool({
          UserPoolId: process.env.REACT_APP_USER_POOL_ID,
          ClientId: process.env.REACT_APP_APP_CLIENT_ID,
        });
        const userData = {
          Username: phoneNumber,
          Pool: userPool,
        };
        const cognitoUser = new CognitoUser(userData);
        yield new Promise((resolve, reject) => {
          cognitoUser.forgotPassword({
            onSuccess: (result) => {
              self.setError(null);
              resolve(result);
            },
            onFailure: (err) => {
              console.error('Error initiating forgot password:', err);
              self.setError(err.message || 'Error initiating forgot password');
              reject(err);
            },
          });
        });
      } catch (error) {
        console.error('Error initiating forgot password:', error);
        self.setError(error.message || 'Error initiating forgot password');
      }
    }),

    signOut: flow(function* signOut() {
      try {
        const userPool = new CognitoUserPool({
          UserPoolId: process.env.REACT_APP_USER_POOL_ID,
          ClientId: process.env.REACT_APP_APP_CLIENT_ID,
        });
        const cognitoUser = userPool.getCurrentUser();
        if (cognitoUser) {
          cognitoUser.signOut();
        }
        self.setUser(null);
        self.setError(null);
      } catch (error) {
        console.error('Error signing out:', error);
      }
    }),

    setUser(user: SnapshotOut<typeof UserModel> | null) {
      self.user = user ? { ...user } : null;
    },

    setError(error: string | null) {
      self.error = error;
    },
  }));

export interface UserStoreModel extends Instance<typeof UserStoreModel> {}
export interface UserStoreSnapshot extends SnapshotOut<typeof UserStoreModel> {}
export interface AuthenticationStore extends Instance<typeof AuthenticationStoreModel> {}
export interface AuthenticationStoreSnapshot extends SnapshotOut<typeof AuthenticationStoreModel> {}

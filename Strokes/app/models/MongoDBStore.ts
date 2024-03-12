import { types, flow } from 'mobx-state-tree';
import client from '../services/api/apollo-client';
import { getRootStore } from './helpers/getRootStore';
import RNFetchBlob from 'rn-fetch-blob';
import {ReactNativeFile} from 'apollo-upload-client'
import { authExchange } from '@urql/extractFiles';
import * as graphQL from '@graphQL'

interface UserData {
  phoneNumber: string;
  email: string;
  _id: string;
  first_name: string;
  last_name: string;
  age: number;
  gender: string;
  sports: string;
  description: string;
  location: string;
}

function createReactNativeFile(imageFiles) {
  return imageFiles.map(
    ({ uri, img_idx }, index) =>
      new ReactNativeFile({
        uri: uri, // Assuming `uri` is correctly provided in the input object
        type: "image/jpg", // Adjust type based on actual file type or metadata if available
        name: `pic-${img_idx}.jpg`, // Use img_idx or index as needed for unique naming
      }),
  )
}


//function createReactNativeFile(imageFiles) {
  //return imageFiles.map((file, index) => ({
    //file: new ReactNativeFile({
      //uri: file,
      //type: "image/jpg", // Adjust type based on actual file type or metadata if available
      //name: `pic-${index}.jpg`, // Example naming convention
    //}),
  //}));
//}


const MongoDBStore = types
  .model('MongoDBStore', {
    // Define any state properties you may need
  })
  .actions((self) => ({
    createUserInMongoDB: flow( function* createUser() {
      try {
        const userStore = getRootStore(self).userStore
        const file = userStore.imageFiles
        rnfiles = createReactNativeFile(file)
        const response = yield client.mutate({
          mutation: graphQL.ADD_PROFILE2,
          variables: {
            phoneNumber: userStore.phoneNumber,
            email: userStore.email,
            _id: userStore._id,
            image_set: rnfiles,
            firstName: userStore.firstName,
            lastName: userStore.lastName,
            age: 33,
            gender: userStore.gender,
            sports: { sport: "Squash", game_level: "1" },
            description: userStore.description,
            neighborhood: { city: userStore.neighborhood, state: "MA", country: "US" },
            //newUserToken: token,
          },
        })
        // Handle success or update state as needed
      } catch (error) {
        console.error("Error creating user:", error)
        // Handle error or set error state
      }
    }),
      queryUserFromMongoDB: flow(function* queryUser(id) {
    try {
      const response = yield client.query({
        query: graphQL.READ_SQUASH,
        variables: {
          id: id,
        },
        fetchPolicy: "network-only", // Use this line to ensure the data is fetched from the network every time and not from cache
      });
      // Assuming response.data.user contains the user data
      const userStore = getRootStore(self).userStore
      const userData = response.data.squash;
      // Do something with the user data, e.g., update the store or return the data
      userStore.setFromMongoDb(userData)
      return userData;
    } catch (error) {
      console.error("Error querying user:", error);
      // Handle error or set error state
      throw error; // Rethrowing the error for handling by the caller
    }
  }),


    // Add more actions for interacting with MongoDB via GraphQL as needed
  }));

export default MongoDBStore;

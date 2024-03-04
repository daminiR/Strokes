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
        //rnfile = new ReactNativeFile({
          //uri: file[0].uri,
          //type: "image/jpg", // Adjust type based on actual file type or metadata if available
          //name: `pic-.jpg`, // Example naming convention
        //})

        //console.log(rnfiles)
        //const response = yield client.mutate({
          //mutation: graphQL.UPLOADIMAGE,
         //variables: {
            //image: rnfile,
          //},
        //})
        const response = yield client.mutate({
          mutation: graphQL.ADD_PROFILE2,
          variables: {
            phoneNumber: userStore.phoneNumber,
            email: userStore.email,
            _id: userStore._id,
            image_set: rnfiles,
            first_name: userStore.firstName,
            last_name: userStore.lastName,
            age: 33,
            gender: userStore.gender,
            sports: { sport: "Squash", game_level: "1" },
            description: userStore.description,
            location: { city: userStore.neighborhood, state: "MA", country: "US" },
            //newUserToken: token,
          },
        })
        // Handle success or update state as needed
      } catch (error) {
        console.error("Error creating user:", error)
        // Handle error or set error state
      }
    }),

    // Add more actions for interacting with MongoDB via GraphQL as needed
  }));

export default MongoDBStore;

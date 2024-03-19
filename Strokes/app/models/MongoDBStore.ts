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

function processImageUpdates(mixedImages, originalImageFiles) {
  // Initialize containers for the processed results
  const addLocalImages = [];
  const removeUploadedImages = [];

  // Create a map of original images for easy lookup by img_idx
  const originalImagesMap = new Map(originalImageFiles.map(img => [img.img_idx, img]));

  // Process the mixed images to classify them
  mixedImages.forEach(image => {
    if ('uri' in image) {
      // If the image structure is {uri, img_idx}, it's a new local image to be added
      addLocalImages.push(image);

      // If replacing an existing uploaded image, add that image to removeUploadedImages
      if (originalImagesMap.has(image.img_idx)) {
        removeUploadedImages.push(originalImagesMap.get(image.img_idx));
      }
    }
    // Note: There's no need to handle the 'imageURL' in image case here,
    // as we're focusing on identifying new local images to add and original images to remove.
  });

  return { addLocalImages, removeUploadedImages };
}

const MongoDBStore = types
  .model("MongoDBStore", {
    // Define any state properties you may need
  })
  .actions((self) => ({
    updateUserInMongoDB: flow(function* updateUser() {
      try {
        const tempUserStore = getRootStore(self).tempUserStore
        const userStore = getRootStore(self).userStore
        const { addLocalImages, removeUploadedImages } = processImageUpdates(
          tempUserStore.imageFiles,
          userStore.imageFiles,
        )
        const add_local_images_rn = createReactNativeFile(addLocalImages)
        console.log(
          "outputs for image manipulation",
          addLocalImages,
          removeUploadedImages,
          userStore.imageFiles,
          tempUserStore.imageFiles,
        )
        //const response = yield client.mutate({
        //mutation: graphQL.UPDATE_USER_PROFILE,
        //variables: {
        //_id: tempUserStore._id,
        //firstName: tempUserStore.firstName,
        //lastName: tempUserStore.lastName,
        //age: tempUserStore.age,
        //add_local_images: add_local_images_rn,
        //remove_uploaded_images: removeUploadedImages,
        //original_uploaded_image_set: userStore.imageFiles,
        //gender: tempUserStore.gender,
        //sports: { sport: "Squash", game_level: "1" },
        //description: tempUserStore.description,
        //location: tempUserStore.neighborhood,
        ////newUserToken: token,
        //},
        //})
        // Handle success or update state as needed
      } catch (error) {
        console.error("Error creating user:", error)
        // Handle error or set error state
      }
    }),
    createUserInMongoDB: flow(function* createUser() {
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
            location: userStore.neighborhood,
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
        })
        // Assuming response.data.user contains the user data
        const userStore = getRootStore(self).userStore
        const userData = response.data.squash
        // Do something with the user data, e.g., update the store or return the data
        userStore.setFromMongoDb(userData)
        return userData
      } catch (error) {
        console.error("Error querying user:", error)
        // Handle error or set error state
        throw error // Rethrowing the error for handling by the caller
      }
    }),

    // Add more actions for interacting with MongoDB via GraphQL as needed
  }))

export default MongoDBStore;

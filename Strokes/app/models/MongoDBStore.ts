import { types, flow } from 'mobx-state-tree';
import client from '../services/api/apollo-client';
import { getRootStore } from './helpers/getRootStore';
import RNFetchBlob from 'rn-fetch-blob';
import {ReactNativeFile} from 'apollo-upload-client'
import { authExchange } from '@urql/extractFiles';
import * as graphQL from '@graphQL'

function cleanGraphQLResponse(object) {
  // If the object is an array, apply the function to each element
  if (Array.isArray(object)) {
    return object.map(cleanGraphQLResponse);
  }
  // If the object is an actual object, clean it
  else if (object !== null && typeof object === 'object') {
    const { __typename, ...cleanedObject } = object; // Destructure to remove __typename
    // Apply the function recursively to all values
    Object.keys(cleanedObject).forEach(
      key => (cleanedObject[key] = cleanGraphQLResponse(cleanedObject[key]))
    );
    return cleanedObject;
  }
  // Base case: the item is neither an object nor an array
  return object;
}

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
  return imageFiles.map(({ uri, img_idx }) => ({
    img_idx: img_idx, // Preserve the image index
    ReactNativeFile: new ReactNativeFile({
      uri: uri, // Assuming `uri` is correctly provided in the input object
      type: "image/jpg", // Adjust type based on actual file type or metadata if available
      name: `pic-${img_idx}.jpg`, // Use img_idx for unique naming
    }),
  }));
}


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
// Deep comparison function
function deepCompare(obj1, obj2) {
  if (obj1 === obj2) return true;
  if (typeof obj1 !== 'object' || typeof obj2 !== 'object' || obj1 == null || obj2 == null) return false;

  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  if (keys1.length !== keys2.length) return false;

  for (let key of keys1) {
    if (!keys2.includes(key)) return false;
    if (typeof obj1[key] === 'function' || typeof obj2[key] === 'function') continue;

    if (!deepCompare(obj1[key], obj2[key])) return false;
  }

  return true;
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

        // Check for changes in fields and embedded objects
        const fieldsToUpdate = [
          "firstName",
          "lastName",
          "age",
          "gender",
          "sport",
          "description",
          "neighborhood",
        ]
        const hasDifferences = fieldsToUpdate.some(
          (field) => !deepCompare(tempUserStore[field], userStore[field]),
        )

        const { addLocalImages, removeUploadedImages } = processImageUpdates(
          tempUserStore.imageFiles,
          userStore.imageFiles,
        )
        const hasImageUpdates = addLocalImages.length > 0 || removeUploadedImages.length > 0

        if (!hasDifferences && !hasImageUpdates) {
          console.log("No changes detected, skipping update.")
          return // Skip mutation if there are no differences
        }

        // Prepare images for GraphQL mutation
        const addLocalImagesRN = createReactNativeFile(addLocalImages)

        // Proceed with the mutation
        const response = yield client.mutate({
          mutation: graphQL.UPDATE_USER_PROFILE,
          variables: {
            _id: userStore._id,
            add_local_images: addLocalImagesRN,
            remove_uploaded_images: removeUploadedImages,
            original_uploaded_image_set: userStore.imageFiles,
            firstName: tempUserStore.firstName,
            lastName: tempUserStore.lastName,
            age: tempUserStore.age,
            gender: tempUserStore.gender,
            sports: tempUserStore.sport,
            description: tempUserStore.description,
            neighborhood: tempUserStore.neighborhood,
          },
        })

        // Clean response and update userStore with new data
        const cleanedResponse = cleanGraphQLResponse(response.data.updateUserProfile)
        userStore.setFromMongoDb({
          ...cleanedResponse,
          email: userStore.email,
          phoneNumber: userStore.phoneNumber,
        })
      } catch (error) {
        console.error("Error updating user:", error)
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
            sports: userStore.sport,
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
        // Do something with the user data, e.g., update the store or return the data
        const cleanedResponse = cleanGraphQLResponse(response.data.squash)
        userStore.setFromMongoDb({
          ...cleanedResponse,
          email: userStore.email,
          phoneNumber: userStore.phoneNumber,
        })
        return cleanedResponse
      } catch (error) {
        console.error("Error querying user:", error)
        // Handle error or set error state
        throw error // Rethrowing the error for handling by the caller
      }
    }),

    // Add more actions for interacting with MongoDB via GraphQL as needed
  }))

export default MongoDBStore;

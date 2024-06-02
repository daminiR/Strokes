import { types, flow } from 'mobx-state-tree';
import client from '../services/api/apollo-client';
import { getRootStore } from './helpers/getRootStore';
import {ReactNativeFile} from 'apollo-upload-client'
import * as graphQL from '@graphQL'
import {SHA256} from 'crypto-js';

function hashObject(obj) {
  const objString = JSON.stringify(obj);
  return SHA256(objString).toString();
}

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
  sport: string;
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
  }))
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
        createReport: flow(function* (reportData) {
      try {
        const response = yield client.mutate({
          mutation: graphQL.CREATE_REPORT_MUTATION,
          variables: {
            reporterId: reportData.reporterId,
            reportedUserId: reportData.reportedUserId,
            reportedContentId: reportData.reportedContentId,
            reportType: reportData.reportType,
            description: reportData.description,
            status: 'pending' // Default status when creating a new report
          },
        });
        // Handle the response as needed, perhaps logging or processing the result
        return { success: true, message: "Report created successfully." };
      } catch (error) {
        console.error("Failed to create report:", error);
        return { success: false, message: "Error creating report." };
      }
    }),
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
          tempUserStore.imageSet,
          userStore.imageSet,
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
            original_uploaded_imageSet: userStore.imageSet,
            firstName: tempUserStore.firstName,
            lastName: tempUserStore.lastName,
            age: tempUserStore.age,
            gender: tempUserStore.gender,
            sport: tempUserStore.sport,
            description: tempUserStore.description,
            neighborhood: tempUserStore.neighborhood,
          },
        })

        // Clean response and update userStore with new data
        const cleanedResponse = cleanGraphQLResponse(response.data.updateProfile)
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
        const file = userStore.imageSet
        rnfiles = createReactNativeFile(file)
        const response = yield client.mutate({
          mutation: graphQL.ADD_PROFILE2,
          variables: {
            phoneNumber: userStore.phoneNumber,
            email: userStore.email,
            _id: userStore._id,
            imageSet: rnfiles,
            firstName: userStore.firstName,
            lastName: userStore.lastName,
            age: 33,
            gender: userStore.gender,
            sport: userStore.sport,
            description: userStore.description,
            neighborhood: userStore.neighborhood,
            //newUserToken: token,
          },
        })
        // Handle success or update state as needed
      } catch (error) {
        console.error("Error creating user:", error)
        // Handle error or set error state
      }
    }),
    createMatch: flow(function* createMatch(user2Id) {
      const user1Id  = getRootStore(self).userStore._id
      return client
        .mutate({
          mutation: graphQL.CREATE_MATCH_MUTATION,
          variables: { user1Id, user2Id },
        })
        .then((response) => {
          const { success, match } = response.data.createMatch
          if (success && match) {
            console.log("Match created successfully:", match)
            return match
          } else {
            console.error("Failed to create match.")
            return null
          }
        })
        .catch((error) => {
          console.error("Error creating match:", error)
          return null
        })
    }),
    checkForMutualLike: flow(function* checkForMutualLike(likedId) {
      const currentUserId = getRootStore(self).userStore._id
      return client
        .query({
          query: graphQL.CHECK_FOR_MUTUAL_LIKE_QUERY,
          variables: { currentUserId, likedId },
        })
        .then((response) => {
          return response.data.checkForMutualLike.isMutual
        })
        .catch((error) => {
          console.error("Failed to check for mutual like:", error)
          return false
        })
    }),
    recordLike: flow(function* recordLike(likedId) {
      const likerId = getRootStore(self).userStore._id
      try {
        const result = yield client.mutate({
          mutation: graphQL.ADD_LIKE_MUTATION,
          variables: {
            likerId,
            likedId,
          },
        })
        if (result.data.recordLike.success) {
          // Handle success (e.g., update UI or state accordingly)
          console.log(result.data.recordLike.message)
          return true
        } else {
          // Handle failure (e.g., show an error message)
          console.error(result.data.recordLike.message)
          return false
        }
      } catch (error) {
        console.error("Error recording like:", error)
        return false
      }
    }),
    applyFilters: flow(function* applyFilters(newFilters, newFilterHash) {
      try {
        const userStore = getRootStore(self).userStore
        const response = yield client.mutate({
          mutation: graphQL.APPLY_FILTERS,
          variables: {
            _id: userStore._id,
            filters: newFilters,
            filtersHash: newFilterHash,
          },
          fetchPolicy: "network-only",
        })
        const filterData = cleanGraphQLResponse(response.data.applyFilters)
        return filterData
      } catch (error) {
        console.error("Error applyign filters:", error)
        throw error
      }
    }),
    queryAfterFilterChange: flow(function* (filters) {
      const userStore = getRootStore(self).userStore
      const matchStore = getRootStore(self).matchStore
      const newFiltersHash = hashObject(filters) // Ensure hashObject function is correctly implemented

        try {
          const potentialMatchesResponse = yield self.applyFilters(filters, newFiltersHash)
          matchStore.setInit(potentialMatchesResponse)
        } catch (error) {
          console.error("Failed to query potential matches:", error)
        }
    }),
    shouldQuery: flow(function* () {
      const matchStore = getRootStore(self).matchStore
      const likedUserStore = getRootStore(self).likedUserStore;  // Assuming there's a store for liked profiles
      const matchedProfileStore = getRootStore(self).matchedProfileStore;  // Assuming there's a store for liked profiles
      const stringTimestamp = matchStore.lastFetched
      const dateObject = new Date(parseInt(stringTimestamp, 10))
      const timeElapsed = Date.now() - dateObject.getTime()
      const oneDayInMs = 24 * 60 * 60 * 1000
      //const oneDayInMs =  60
      //if (timeElapsed > oneDayInMs) {
      //alsoFetch new lastFetched if there is new data last fetched should have been updated in trgiger
      yield self.queryPotentialMatches()
      const likedProfilesData = yield self.queryLikedUserProfiles(1, 10)
      const matchedUserData = yield self.queryMatchedUserProfiles(1, 16)
      likedUserStore.setProfiles(likedProfilesData);  // Set or update the liked profiles in the store
      matchedProfileStore.setProfiles(matchedUserData);  // Set or update the liked profiles in the store
      //}
    }),
    // Function to update the interacted status in matchQueue
    updateMatchQueueInteracted: flow(function* updatedMatchInteracted(
      currentUserId,
      matchUserId,
      isLiked,
    ) {
      try {
        const result = yield client.mutate({
          mutation: graphQL.UPDATE_MATCH_QUEUE_INTERACTED_MUTATION,
          variables: {
           currentUserId:  currentUserId,
            matchUserId: matchUserId,
            isLiked: isLiked,
          },
        })
        // Assuming your GraphQL API returns a success field in the response
        const cleanedResponse = cleanGraphQLResponse(result.data.updateMatchQueueInteracted)
        console.log("cleaned respo", cleanedResponse)
        if (cleanedResponse.success) {
          console.log("Successfully updated matchQueue interacted status")
          return cleanedResponse
        } else {
          console.error("Failed to update matchQueue interacted status")
        }
      } catch (error) {
        console.error("Error updating matchQueue interacted status:", error)
        throw error
      }
    }),
    queryMatchedUserProfiles: flow(function* updateMatchedUserProfiles(page, limit) {
        const userId = getRootStore(self).userStore._id// Assuming this is how you access userStore
        try {
            const response = yield client.query({
                query: graphQL.FETCH_MATCHES_FOR_USER_QUERY,
                variables: {
                    userId: userId,
                    page: page,
                    limit: limit
                },
                fetchPolicy: "network-only",  // Ensures fresh data on every call
            });
            const matchedProfileData = cleanGraphQLResponse(response.data.fetchMatchesForUser) // Assuming response is structured correctly
            return matchedProfileData;  // Return data for further processing if necessary
        } catch (error) {
            console.error("Error querying liked user profiles:", error);
            throw error;
        }
    }),
    queryLikedUserProfiles: flow(function* updateMatchQueueInteracted(page, limit) {
        const userId = getRootStore(self).userStore._id// Assuming this is how you access userStore
        const likedUserStore = getRootStore(self).likedUserStore;  // Assuming there's a store for liked profiles
        try {
            const response = yield client.query({
                query: graphQL.GET_LIKED_USER_PROFILES,
                variables: {
                    userId: userId,
                    page: page,
                    limit: limit
                },
                fetchPolicy: "network-only",  // Ensures fresh data on every call
            });
            const likedProfilesData = cleanGraphQLResponse(response.data.fetchLikedIds) // Assuming response is structured correctly
            return likedProfilesData;  // Return data for further processing if necessary
        } catch (error) {
            console.error("Error querying liked user profiles:", error);
            throw error;
        }
    }),
    queryPotentialMatches: flow(function* () {
      const userStore = getRootStore(self).userStore
      const matchStore = getRootStore(self).matchStore
      try {
        const response = yield client.query({
          query: graphQL.GET_POTENTIAL_MATCHES,
          variables: {
            _id: userStore._id,
          },
          fetchPolicy: "network-only",
        })
        const matchesData = cleanGraphQLResponse(response.data.fetchFilteredMatchQueue)
        matchStore.setInit(matchesData)
        return matchesData
      } catch (error) {
        console.error("Error querying potential matches:", error)
        throw error
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
        const cleanedResponse = cleanGraphQLResponse(response.data.fetchProfileById)
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

import {types, flow} from 'mobx-state-tree';
import {getRootStore} from './helpers/getRootStore';
import * as graphQL from '@graphQL'
import {hashObject, cleanGraphQLResponse, createReactNativeFile, processImageUpdates, deepCompare} from '../utils/utils';


const MongoDBStore = types
  .model("MongoDBStore", {
    // Define any state properties you may need
  })
  .props({
  })
  .volatile(self => ({
    userStore: null, // Initialize as null and set in afterCreate
    authenticationStore: null,
    matchStore: null,
    likedUserStore: null,
    matchedProfileStore: null,
  }))
  .actions((self) => ({
    afterAttach() {
      self.userStore = getRootStore(self).userStore;
      self.authenticationStore = getRootStore(self).authenticationStore;
      self.matchStore = getRootStore(self).matchStore
      self.likedUserStore = getRootStore(self).likedUserStore // Assuming there's a store for liked profiles
      self.matchedProfileStore = getRootStore(self).matchedProfileStore // Assuming there's a store for liked profiles
    },
    unmatchPlayer: flow(function* (matchId, reason) {
      const privateClient = self.authenticationStore.apolloClient
      try {
        const result = yield privateClient.mutate({
          mutation: graphQL.REMOVE_MATCH_MUTATION,
          variables: {
            matchId: matchId,
            userId: self.userStore._id,
            reason: reason,
          },
        })
        const {success, message} = result.data.removeMatch
        if (success) {
          console.log("Player unmatched successfully:", message)
          self.matchStore.removeMatchedProfile(matchId)
          // Handle any additional state updates if necessary
        } else {
          console.error("Failed to unmatch player:", message)
        }
        return {success, message}
      } catch (error) {
        console.error("Error unmatching player:", error)
        return {success: false, message: "Error executing unmatch operation."}
      }
    }),
    createReport: flow(function* createReport(reportData) {
      const privateClient = self.authenticationStore.apolloClient
      try {
        const response = yield privateClient.mutate({
          mutation: graphQL.CREATE_REPORT_MUTATION,
          variables: {
            reporterId: reportData.reporterId,
            reportedUserId: reportData.reportedUserId,
            reportType: reportData.reportType,
            description: reportData.description,
          },
        })

        // Assuming response.data.createReport.success exists based on typical GraphQL responses
        if (response.data.createReport.success) {
          console.log("Report created successfully:", response.data.createReport.message)
          return {success: true, message: "Report created successfully."}
        } else {
          console.log("Failed to create report:", response.data.createReport.message)
          return {
            success: false,
            message:
              response.data.createReport.message || "Failed to create report for unknown reasons.",
          }
        }
      } catch (error) {
        console.error("Failed to create report:", error)
        return {success: false, message: "Error creating report."}
      }
    }),
    updateUserInMongoDB: flow(function* updateUser() {
      try {
        const tempUserStore = getRootStore(self).tempUserStore
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
          (field) => !deepCompare(tempUserStore[field], self.userStore[field]),
        )
        const {addLocalImages, removeUploadedImages} = processImageUpdates(
          tempUserStore.imageSet,
          self.userStore.imageSet,
        )
        const hasImageUpdates = addLocalImages.length > 0 || removeUploadedImages.length > 0
        if (!hasDifferences && !hasImageUpdates) {
          console.log("No changes detected, skipping update.")
          return // Skip mutation if there are no differences
        }
        //remeber order here matters, cannot deep check after muation
        const neighborhoodHasChanged = !deepCompare(tempUserStore.neighborhood, self.userStore.neighborhood);
        // Prepare images for GraphQL mutation
        const addLocalImagesRN = createReactNativeFile(addLocalImages)
        // Proceed with the mutation
        const privateClient = self.authenticationStore.apolloClient
        const response = yield privateClient.mutate({
          mutation: graphQL.UPDATE_USER_PROFILE,
          variables: {
            _id: self.userStore._id,
            add_local_images: addLocalImagesRN,
            remove_uploaded_images: removeUploadedImages,
            original_uploaded_imageSet: self.userStore.imageSet,
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
        self.userStore.setFromMongoDb({
          ...cleanedResponse,
          email: self.userStore.email,
          phoneNumber: self.userStore.phoneNumber,
        })
        if (neighborhoodHasChanged) {
          const filterData = yield self.applyNeighborhoodFilter()
          self.matchStore.setMatchPool(filterData)
          console.log("Neighborhood filter applied:", filterData)
        }
      } catch (error) {
        console.error("Error updating user:", error)
      }
    }),
    createUserInMongoDB: flow(function* createUser() {
      try {
        const privateClient = self.authenticationStore.apolloClient
        const file = self.userStore.imageSet
        rnfiles = createReactNativeFile(file)
        const response = yield privateClient.mutate({
          mutation: graphQL.ADD_PROFILE2,
          variables: {
            phoneNumber: self.userStore.phoneNumber,
            email: self.userStore.email,
            _id: self.userStore._id,
            imageSet: rnfiles,
            firstName: self.userStore.firstName,
            lastName: self.userStore.lastName,
            age: 33,
            gender: self.userStore.gender,
            sport: self.userStore.sport,
            description: self.userStore.description,
            //neighborhood: userStore.neighborhood,
          },
        })
        // Handle success or update state as needed
      } catch (error) {
        console.error("Error creating user:", error)
        // Handle error or set error state
      }
    }),
    createMatch(user2Id) {
      const privateClient = self.authenticationStore.apolloClient
      const user1Id = self.userStore._id
      return privateClient
        .mutate({
          mutation: graphQL.CREATE_MATCH_MUTATION,
          variables: {user1Id, user2Id},
        })
        .then((response) => {
          const {success, match} = response.data.createMatch
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
    },
    checkForMutualLike(likedId) {
      const currentUserId = self.userStore._id
      const privateClient = self.authenticationStore.apolloClient
      return privateClient
        .query({
          query: graphQL.CHECK_FOR_MUTUAL_LIKE_QUERY,
          variables: {currentUserId, likedId},
        })
        .then((response) => {
          return response.data.checkForMutualLike.isMutual
        })
        .catch((error) => {
          console.error("Failed to check for mutual like:", error)
          return false
        })
    },
    recordLike: flow(function* recordLike(likedId) {
      const likerId = self.userStore._id
      const privateClient = self.authenticationStore.apolloClient
      try {
        const result = yield privateClient.mutate({
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
    applyNeighborhoodFilter: flow(function* applyNeighborhoodFilter() {
      try {
        const privateClient = self.authenticationStore.apolloClient
        const response = yield privateClient.mutate({
          mutation: graphQL.APPLY_NEIGHBORHOOD_FILTER,
          variables: {
            _id: self.userStore._id,
            neighborhood: self.userStore.neighborhood,
          },
          fetchPolicy: "network-only",
        })
        const filterData = response.data.applyNeighborhoodFilter
        return filterData
      } catch (error) {
        console.error("Error applying neighborhood filter:", error)
        throw error
      }
    }),
    applyFilters: flow(function* applyFilters(newFilters, newFilterHash) {
      try {
        const privateClient = self.authenticationStore.apolloClient
        const response = yield privateClient.mutate({
          mutation: graphQL.APPLY_FILTERS,
          variables: {
            _id: self.userStore._id,
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
      const newFiltersHash = hashObject(filters) // Ensure hashObject function is correctly implemented

      try {
        const potentialMatchesResponse = yield self.applyFilters(filters, newFiltersHash)
        self.matchStore.setInit(potentialMatchesResponse)
      } catch (error) {
        console.error("Failed to query potential matches:", error)
      }
    }),
    fetchMatchInteractionData: flow(function* () {
      yield self.queryPotentialMatches()
      const likedProfilesData = yield self.queryLikedUserProfiles(1, 10)
      const matchedUserData = yield self.queryMatchedUserProfiles(1, 16)
      self.likedUserStore.setProfiles(likedProfilesData) // Set or update the liked profiles in the store
      self.matchedProfileStore.setProfiles(matchedUserData) // Set or update the liked profiles in the store
    }),
    // Function to update the interacted status in matchQueue
    updateMatchQueueInteracted: flow(function* updatedMatchInteracted(
      currentUserId,
      matchUserId,
      isLiked,
    ) {
      try {
        const privateClient = self.authenticationStore.apolloClient
        const result = yield privateClient.mutate({
          mutation: graphQL.UPDATE_MATCH_QUEUE_INTERACTED_MUTATION,
          variables: {
            currentUserId: currentUserId,
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
      const userId = self.userStore._id // Assuming this is how you access userStore
      const privateClient = self.authenticationStore.apolloClient
      try {
        const response = yield privateClient.query({
          query: graphQL.FETCH_MATCHES_FOR_USER_QUERY,
          variables: {
            userId: userId,
            page: page,
            limit: limit,
          },
          fetchPolicy: "network-only", // Ensures fresh data on every call
        })
        const matchedProfileData = cleanGraphQLResponse(response.data.fetchMatchesForUser) // Assuming response is structured correctly
        return matchedProfileData // Return data for further processing if necessary
      } catch (error) {
        console.error("Error querying liked user profiles:", error)
        throw error
      }
    }),
    queryLikedUserProfiles: flow(function* updateMatchQueueInteracted(page, limit) {
      const userId = self.userStore._id // Assuming this is how you access userStore
      const privateClient = self.authenticationStore.apolloClient
      try {
        const response = yield privateClient.query({
          query: graphQL.GET_LIKED_USER_PROFILES,
          variables: {
            userId: userId,
            page: page,
            limit: limit,
          },
          fetchPolicy: "network-only", // Ensures fresh data on every call
        })
        const likedProfilesData = cleanGraphQLResponse(response.data.fetchLikedIds) // Assuming response is structured correctly
        return likedProfilesData // Return data for further processing if necessary
      } catch (error) {
        console.error("Error querying liked user profiles:", error)
        throw error
      }
    }),
    queryPotentialMatches: flow(function* () {
      const privateClient = self.authenticationStore.apolloClient
      try {
        const response = yield privateClient.query({
          query: graphQL.GET_POTENTIAL_MATCHES,
          variables: {
            _id: self.userStore._id,
          },
          fetchPolicy: "network-only",
        })
        const matchesData = cleanGraphQLResponse(response.data.fetchFilteredMatchQueue)
        self.matchStore.setInit(matchesData)
        return matchesData
      } catch (error) {
        console.error("Error querying potential matches:", error)
        throw error
      }
    }),
    queryUserFromMongoDB: flow(function* queryUser(id) {
      const privateClient = self.authenticationStore.apolloClient
      try {
        const response = yield privateClient.query({
          query: graphQL.READ_SQUASH,
          variables: {
            id: id,
          },
          fetchPolicy: "network-only", // Use this line to ensure the data is fetched from the network every time and not from cache
        })
        // Do something with the user data, e.g., update the store or return the data
        const cleanedResponse = cleanGraphQLResponse(response.data.fetchProfileById)
        self.userStore.setFromMongoDb({
          ...cleanedResponse,
          email: self.userStore.email,
          phoneNumber: self.userStore.phoneNumber,
        })
        return cleanedResponse
      } catch (error) {
        console.error("Error querying user:", error)
        // Handle error or set error state
        throw error // Rethrowing the error for handling by the caller
      }
    }),
  }))

export default MongoDBStore

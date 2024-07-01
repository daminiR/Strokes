import { types, flow, cast, SnapshotOrInstance, SnapshotOut, Instance, getRoot} from 'mobx-state-tree';
import storage from 'app/utils/storage/mmkvStorage';
import { Alert } from 'react-native';
import { getRootStore } from './helpers/getRootStore';
import { makeAutoObservable, runInAction } from 'mobx';

export const LocationModel = types.model("LocationModel", {
  city: types.maybeNull(types.string),
  state: types.maybeNull(types.string),
  country: types.maybeNull(types.string),
})
export const SportModel = types.model("SportModel", {
  sportName: types.maybeNull(types.string),
  gameLevel: types.maybeNull(types.number),
})
export const ImageModel = types.model("ImageModel", {
  img_idx: types.maybeNull(types.number),
  imageURL: types.maybeNull(types.string),
});
const Range = types.model("RangeModel", {
  min: types.maybeNull(types.number),
  max: types.maybeNull(types.number),
});
export const PreferencesModel = types.model("PreferencesModel", {
  age: types.maybeNull(Range),
  gameLevel: types.maybeNull(Range),
});

export const PotentialMatchModel = types.model("PotentialMatchModel", {
  matchUserId: types.maybeNull(types.string),
  firstName: types.maybeNull(types.string),
  age: types.maybeNull(types.number),
  interacted: types.maybeNull(types.boolean),
  gender: types.maybeNull(types.string),
  sport: types.maybeNull(SportModel),
  description: types.maybeNull(types.string),
  imageSet: types.array(ImageModel),
  neighborhood: LocationModel,
});

const MatchesStoreModel = types
  .model("MatchStore", {
    matchPool: types.array(PotentialMatchModel),
    lastUpdated: types.maybeNull(types.string),
    filtersHash: types.maybeNull(types.string),
    filters: types.maybeNull(PreferencesModel),
  })
  .actions((self) => ({
    dislikeAction: flow(function* (dislikedId) {
      try {
        const userStore = getRootStore(self).userStore
        const mongoDBStore = getRootStore(self).mongoDBStore
        const likedUserStore = getRootStore(self).likedUserStore
        // Update the function call with the correct argument name for clarity
        const matchData = yield mongoDBStore.updateMatchQueueInteracted(
          userStore._id,
          dislikedId,
          false,
        )
        if (matchData.success) {
          runInAction(() => {
            self.matchPool = matchData.data.potentialMatches
            likedUserStore.removeLikedUser(dislikedId)
          })
        } else {
          console.error("Failed to update match queue:", matchData.message)
          // Optionally, provide feedback to the user if the operation was not successful
          Alert.alert("Update Failed", matchData.message)
        }
      } catch (error) {
        console.error("Error during dislike action:", error)
        // Optionally, notify the user about the error
        Alert.alert(
          "Error",
          "An unexpected error occurred during the dislike action. Please try again.",
        )
      }
    }),
    likeAction: flow(function* (likedId) {
      const mongoDBStore = getRootStore(self).mongoDBStore
      const userStore = getRootStore(self).userStore
      const likedUserStore = getRootStore(self).likedUserStore
      let attemptCount = 0
      let success = false

      while (!success && attemptCount < 3) {
        try {
          success = yield mongoDBStore.recordLike(likedId)
          // Always update the interaction status regardless of like success
          const matchData = yield mongoDBStore.updateMatchQueueInteracted(
            userStore._id,
            likedId,
            true,
          )
          if (matchData.success) {
            runInAction(() => {
              self.matchPool = matchData.data.potentialMatches
            })
          } else {
            console.error(matchData.message)
          }

          if (success) {
            // Check for mutual like indicating a match
            const isMatch = yield mongoDBStore.checkForMutualLike(likedId)
            if (isMatch) {
              // Record the match in the matches collection
              yield mongoDBStore.createMatch(likedId)
              // Optionally, update UI or state to reflect the new match
              // remove from likedSet if any
              likedUserStore.removeLikedUser(likedId)
              return true
            }
            // Exit the loop if like is successfully recorded
            break
          } else {
            attemptCount++
            console.log(`Attempt ${attemptCount}: Failed to record like.`)
          }
        } catch (error) {
          console.error(`Error on attempt ${attemptCount} recording like:`, error)
          attemptCount++
          // Wait for a second before retrying (simple exponential backoff could be implemented here)
          yield new Promise((resolve) => setTimeout(resolve, 1000 * attemptCount))
        }
      }

      if (!success) {
        // After retries, if like is still not successful, provide feedback to the user
        Alert.alert(
          "Like Failed",
          "Could not record the like due to an internal server error. Please try again later.",
          [{ text: "OK" }],
        )
      }
    }),
    setInit: flow(function* (matchesData: any) {
      // Using yield within a flow to handle the asynchronous call
      self.matchPool = matchesData.potentialMatches ?? []
      self.filters = matchesData.filters
      self.filtersHash = matchesData.filtersHash
      self.lastUpdated = matchesData.lastUpdated
      // You can now use potentialMatches if needed
    }),
    setLastUpdated(lastUpdated: any) {
      self.lastUpdated = lastUpdated
    },
    setFiltersHash(newPreferencesHash: string) {
      self.filtersHash = newPreferencesHash
    },
    setFilters(newPreferences: SnapshotIn<typeof PreferencesModel>) {
      self.filters = newPreferences
    },
    setMatchPool(matches: any) {
      self.matchPool.replace(matches)
    },
    fetchAndUpdateMatches: flow(function* (filters) {
      // Example API call to fetch matches based on filters
      const mongoDBStore = getRootStore(self).mongoDBStore
      try {
        const newMatches = yield mongoDBStore.queryPotentialMatches(filters)
        self.setMatchPool(newMatches)
      } catch (error) {
        console.error("Failed to fetch and update matches:", error)
      }
    }),
    loadStoredMatches: flow(function* () {
      try {
        const storedMatches = yield storage.getString("matches")
        if (storedMatches) {
          const matches = JSON.parse(storedMatches)
          self.setMatchPool(matches)
        }
      } catch (error) {
        console.error("Failed to load stored matches:", error)
      }
    }),
  }))
    // Add other actions as needed
export default MatchesStoreModel

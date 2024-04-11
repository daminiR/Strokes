import { types, flow, cast, SnapshotOrInstance, SnapshotOut, Instance, getRoot} from 'mobx-state-tree';
import { Alert } from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage"
import { getRootStore } from './helpers/getRootStore';

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
  image_set: types.array(ImageModel),
  neighborhood: LocationModel,
});
const MatchesStoreModel = types
  .model("MatchStore", {
    matchPool: types.array(PotentialMatchModel),
    lastFetchedFromTrigger: types.maybeNull(types.string),
    preferencesHash: types.maybeNull(types.string),
    preferences: types.maybeNull(PreferencesModel),
  })
  .actions((self) => ({
    likeAction: flow(function* (likedId) {
      const mongoDBStore = getRootStore(self).mongoDBStore
      const userStore = getRootStore(self).userStore
      let attemptCount = 0
      let success = false

      while (!success && attemptCount < 1) {
        // Retry up to 3 times
        try {
          success = yield mongoDBStore.recordLike(likedId)

          if (success) {
            // Remove the liked user from the matchPool
            const matchedUser = self.matchPool.find((user) => user.matchUserId === likedId)
            if (matchedUser) {
              matchedUser.interacted = true; // Update the interacted flag directly
            }
            // Update the interacted status in matchQueue
            yield mongoDBStore.updateMatchQueueInteracted(userStore._id, likedId, true)

            // Check for mutual like indickting a match
            const isMatch = yield mongoDBStore.checkForMutualLike(likedId)

            if (isMatch) {
              // Record the match in the matches collection
              yield mongoDBStore.createMatch(likedId)
              // Optionally, update UI or state to reflect the new match
               Alert.alert('Congratulations! You have a new match.');

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
    setInit: flow(function* (userData: any) {
      // Using yield within a flow to handle the asynchronous call
      const mongoDBStore = getRootStore(self).mongoDBStore
      const potentialMatches = yield mongoDBStore.queryPotentialMatches()
      self.lastFetchedFromTrigger = userData.lastFetchedFromTrigger
      self.preferences = userData.preferences
      self.preferencesHash = userData.preferencesHash
      // You can now use potentialMatches if needed
    }),
    setLastFetchedFromTrigger(lastFetchedFromTrigger: any) {
      self.lastFetchedFromTrigger = lastFetchedFromTrigger
    },
    setPreferencesHash(newPreferencesHash: string) {
      self.preferencesHash = newPreferencesHash
    },
    setPreferences(newPreferences: SnapshotIn<typeof PreferencesModel>) {
      self.preferences = newPreferences
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
        //yield AsyncStorage.setItem("matches", JSON.stringify(newMatches))
      } catch (error) {
        console.error("Failed to fetch and update matches:", error)
      }
    }),
    loadStoredMatches: flow(function* () {
      try {
        const storedMatches = yield AsyncStorage.getItem("matches")
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

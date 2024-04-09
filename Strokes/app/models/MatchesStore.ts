import { types, flow, cast, SnapshotOrInstance, SnapshotOut, Instance, getRoot} from 'mobx-state-tree';
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
  _id: types.maybeNull(types.string),
  firstName: types.maybeNull(types.string),
  age: types.maybeNull(types.number),
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
    filtersChangesPerDay: types.maybeNull(types.number),
  })
  .actions((self) => ({
    setInit: flow(function* (userData: any) {
      // Using yield within a flow to handle the asynchronous call
      const mongoDBStore = getRootStore(self).mongoDBStore
      const potentialMatches = yield mongoDBStore.queryPotentialMatches()
      self.lastFetchedFromTrigger = userData.lastFetchedFromTrigger
      self.preferences = userData.preferences
      self.preferencesHash = userData.preferencesHash
      self.filtersChangesPerDay = userData.filtersChangesPerDay
      // You can now use potentialMatches if needed
    }),
    setFiltersChangesPerDay(filtersChangesPerDay: number) {
      self.filtersChangesPerDay = filtersChangesPerDay
    },
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

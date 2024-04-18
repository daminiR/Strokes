import { applySnapshot, types, flow, cast, SnapshotOrInstance, SnapshotOut, Instance, getRoot} from 'mobx-state-tree';
import { CognitoUser, CognitoUserAttribute, AuthenticationDetails, CognitoUserPool } from 'amazon-cognito-identity-js';
import { getRootStore } from './helpers/getRootStore';

const ImageDataModel = types.model({
  file: types.maybeNull(types.string),
  img_idx: types.integer,
})
const GameLevelModel = types.model({
  gameLevel: types.maybeNull(types.number),
  sportName: types.maybeNull(types.string),
})
const NeighborhoodModel = types.model({
  city: types.maybeNull(types.string),
  state: types.maybeNull(types.string),
  country: types.maybeNull(types.string),
})

export const TempStoreModel = types
  .model("UserStoreModel", {
    age: types.maybeNull(types.integer), // Assuming you're providing a unique identifier when creating a user instance
    isHydrated: types.maybeNull(types.boolean),
    sport: types.maybeNull(GameLevelModel),
    imageSet: types.optional(types.array(types.frozen()), []),
    gender: types.optional(types.enumeration("Gender", ["male", "female", "other"]), "other"),
    description: types.maybeNull(types.string),
    firstName: types.maybeNull(types.string),
    lastName: types.maybeNull(types.string),
    neighborhood: types.maybeNull(NeighborhoodModel),
  })
  .actions((self) => ({
    setIsHydrated(isHydrated) {
      self.isHydrated = isHydrated
    },
    setEmail(email: string) {
      self.email = email
    },
    setSport(squash_level: string) {
      self.sport = [{sportName: "squash", gameLevel: squash_level}]
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
    setAge(age: string) {
      self.age = parseInt(age, 10);
    },
    setImageSet(imageSet: SnapshotOrInstance<typeof ImageDataModel>[]) {
      self.imageSet = cast(imageSet)
    },
    setNeighborhood(neighborhood: string) {
      self.neighborhood = neighborhood
    },
    setDescription(description: string) {
      self.description = description
    },
    setID(_id: string) {
      self._id = _id
    },
    hydrateFromUserStore() {
      const userStore = getRootStore(self).userStore // Assuming userStore is at the root of your store tree
      const newSnapshot = {
        ...self.toJSON(), // Spread the existing fields of tempStore to maintain non-overridden values
        isHydrated: true, // Mark as hydrated
        email: userStore.email,
        age: userStore.age,
        phoneNumber: userStore.phoneNumber,
        sport: GameLevelModel.create({
          sportName: userStore.sport.sportName,
          gameLevel: userStore.sport.gameLevel,
        }),
        imageSet: userStore.imageSet.map((imageFile: any) => cast(imageFile)), // Use cast for MST types
        gender: userStore.gender,
        description: userStore.description,
        firstName: userStore.firstName,
        lastName: userStore.lastName,
        neighborhood: NeighborhoodModel.create({
          city: userStore.neighborhood.city,
          state: userStore.neighborhood.state,
          country: userStore.neighborhood.country,
        }),
        // Any additional fields you wish to hydrate...
      }
      applySnapshot(self, newSnapshot)
    },
    setFromMongoDb(userData) {
      //self.email = userData.email
      //self.age = userData.age
      //self.phoneNumber = userData.phoneNumber
      //self.sport = userData.sports
      //self.firstName = userData.firstName
      //self.lastName = userData.lastName
      //self.gender = userData.gender
      //self.imageFiles = cast(userData.imageSet)
      //self.neighborhood = userData.neighborhood
      //self.description = userData.description
    },
    reset() {
      //self._id = ""
      //self.authPassword = ""
      //self.firstName = ""
      //self.lastName = ""
      //self.gender = ""
      //self.neighborhood = ""
      //self.description = ""
    },
    // Add other actions as needed
  }))

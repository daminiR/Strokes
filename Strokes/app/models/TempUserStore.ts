import { types, flow, cast, SnapshotOrInstance, SnapshotOut, Instance, getRoot} from 'mobx-state-tree';
import { CognitoUser, CognitoUserAttribute, AuthenticationDetails, CognitoUserPool } from 'amazon-cognito-identity-js';
//import MongoDBStore from './MongoDBStore';
import { getRootStore } from './helpers/getRootStore';

const ImageDataModel = types.model({
  file: types.maybeNull(types.string),
  img_idx: types.integer,
})
const GameLevelModel = types.model({
  game_level: types.maybeNull(types.string),
  sport: types.maybeNull(types.string),
})
const NeighborhoodModel = types.model({
  city: types.maybeNull(types.string),
  state: types.maybeNull(types.string),
  country: types.maybeNull(types.string),
})

export const TempStoreModel = types
  .model("UserStoreModel", {
    age: types.maybeNull(types.integer), // Assuming you're providing a unique identifier when creating a user instance
    phoneNumber: types.maybeNull(types.string),
    isHydrated: types.maybeNull(types.boolean),
    email: types.maybeNull(types.string),
    sport: types.optional(types.array(GameLevelModel), []),
    imageFiles: types.optional(types.array(types.frozen()), []),
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
    setAge(age) {
      self.age = age
    },
    setImageFiles(imageFiles: SnapshotOrInstance<typeof ImageDataModel>[]) {
      self.imageFiles = cast(imageFiles)
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
    hydrateFromUserStore(){
      const userStore = getRootStore(self).userStore
      console.log("neighborhood, ", userStore.neighborhood)
      self.email = userStore.email
      self.age = userStore.age
      self.phoneNumber = userStore.phoneNumber
      self.sport = userStore.sports
      self.firstName = userStore.firstName
      self.lastName = userStore.lastName
      self.gender = userStore.gender
      self.imageFiles = cast(userStore.image_set)
      self.neighborhood = {
        city: userStore.neighborhood.city,
        state: userStore.neighborhood.state,
        country: userStore.neighborhood.country,
      },
        self.description = userStore.description
    },
    setFromMongoDb(userData){
      self.email = userData.email
      self.age = userData.age
      self.phoneNumber = userData.phoneNumber
      self.sport = userData.sports
      self.firstName = userData.firstName
      self.lastName = userData.lastName
      self.gender = userData.gender
      self.imageFiles = cast(userData.image_set)
      self.neighborhood = userData.neighborhood
      self.description = userData.description
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

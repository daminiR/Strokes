import { types, IType, flow, cast, SnapshotOrInstance, SnapshotOut, Instance, getRoot} from 'mobx-state-tree';
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

export const UserStoreModel = types
  .model("UserStoreModel", {
    _id: types.maybeNull(types.string), // Assuming you're providing a unique identifier when creating a user instance
    age: types.maybeNull(types.integer), // Assuming you're providing a unique identifier when creating a user instance
    authPassword: types.maybeNull(types.string),
    phoneNumber: types.maybeNull(types.string),
    email: types.maybeNull(types.string),
    sport: types.maybeNull(GameLevelModel),
    imageSet: types.optional(types.array(types.frozen()), []),
    gender: types.optional(types.enumeration("Gender", ["male", "female", "other"]), "other"),
    description: types.maybeNull(types.string),
    firstName: types.maybeNull(types.string),
    lastName: types.maybeNull(types.string),
    neighborhood: types.maybeNull(NeighborhoodModel),
  })
  .actions((self) => ({
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
    setAge(age: string) {
      self.age = parseInt(age, 10);
    },
    setImageSet(imageSet: SnapshotOrInstance<typeof ImageDataModel>[]) {
      self.imageSet = cast(imageSet)
    },
    setNeighborhood(neighborhood: string) {
      self.neighborhood = neighborhood
    },
    setSport(squash_level: number) {
      self.sport = {sportName: "squash", gameLevel: Number(squash_level)}
    },
    setDescription(description: string) {
      self.description = description
    },
    setID(_id: string) {
      self._id = _id
    },
    setFromMongoDb(userData){
      const matchStore = getRootStore(self).matchStore
      matchStore.setInit(userData)
      self.email = userData.email
      self.age = userData.age
      self.phoneNumber = userData.phoneNumber
      self.sport = userData.sport
      self.firstName = userData.firstName
      self.lastName = userData.lastName
      self.gender = userData.gender
      self.imageSet = cast(userData.imageSet)
      self.neighborhood = userData.neighborhood
      self.description = userData.description
    },
    reset() {
    },
    // Add other actions as needed
  }))

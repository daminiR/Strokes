import {applySnapshot, types, flow, cast, SnapshotOrInstance, SnapshotOut, Instance, getRoot} from 'mobx-state-tree';
import {getRootStore} from './helpers/getRootStore';

const ImageDataModel = types.model({
  file: types.maybeNull(types.string),
  img_idx: types.integer,
})
const GameLevelModel = types.model({
  gameLevel: types.maybeNull(types.number),
  sportName: types.maybeNull(types.string),
})
export const NeighborhoodModel = types.model({
  city: types.maybeNull(types.string),
  state: types.maybeNull(types.string),
  country: types.maybeNull(types.string),
})

export const TempStoreModel = types
  .model("UserStoreModel", {
    age: types.maybeNull(types.integer), // Assuming you're providing a unique identifier when creating a user instance
    isHydrated: types.maybeNull(types.boolean),
    photosAppIsActive: types.optional(types.boolean, false),
    sport: types.maybeNull(GameLevelModel),
    imageSet: types.optional(types.array(types.frozen()), []),
    gender: types.optional(types.enumeration("Gender", ["male", "female", "other"]), "other"),
    description: types.maybeNull(types.string),
    firstName: types.maybeNull(types.string),
    lastName: types.maybeNull(types.string),
    neighborhood: types.maybeNull(NeighborhoodModel),
  })
  .actions((self) => ({
    openPhotosApp() {
      self.photosAppIsActive = true
      // Logic to open the photos app goes here
    },
    closePhotosApp() {
      self.photosAppIsActive = false
    },
    setIsHydrated(isHydrated) {
      self.isHydrated = isHydrated
    },
    setSport(squash_level: number) {
      self.sport = {sportName: "squash", gameLevel: Number(squash_level)}
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
      self.age = parseInt(age, 10)
    },
    setImageSet(imageSet: SnapshotOrInstance<typeof ImageDataModel>[]) {
      self.imageSet = cast(imageSet)
    },
    setNeighborhood(neighborhood: SnapshotOrInstance<typeof NeighborhoodModel>) {
      self.neighborhood = cast(neighborhood);
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
        email: userStore?.email,
        age: userStore?.age,
        phoneNumber: userStore?.phoneNumber,
        sport: GameLevelModel.create({
          sportName: userStore?.sport?.sportName,
          gameLevel: userStore?.sport?.gameLevel,
        }),
        imageSet: userStore?.imageSet.map((imageFile: any) => cast(imageFile)),
        gender: userStore?.gender,
        description: userStore?.description,
        firstName: userStore?.firstName,
        lastName: userStore?.lastName,
        neighborhood: NeighborhoodModel.create({
          city: userStore?.neighborhood?.city,
          state: userStore?.neighborhood?.state,
          country: userStore?.neighborhood?.country,
        }),
        // Any additional fields you wish to hydrate...
      }
      applySnapshot(self, newSnapshot)
    },
    reset() {
    },
    // Add other actions as needed
  }))

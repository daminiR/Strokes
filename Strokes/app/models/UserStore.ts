import { types, IType, flow, cast, SnapshotOrInstance, SnapshotOut, Instance, getRoot} from 'mobx-state-tree';

const ImageDataModel = types.model({
  file: types.maybeNull(types.string),
  img_idx: types.integer,
})
// Custom MST type for handling Date objects
const MSTDate: IType<string, string, Date> = types.custom({
  name: "MSTDate",
  fromSnapshot(value: string): Date {
    return new Date(value);
  },
  toSnapshot(value: Date): string {
    return value.toISOString();
  },
  isTargetType(value: Date | string): value is Date {
    return value instanceof Date;
  },
  getValidationMessage(snapshotValue: string): string {
    return isNaN(Date.parse(snapshotValue)) ? "Invalid date" : "";
  }
});

const MatchQueueModel = types.model({
  _id: types.maybeNull(types.string),
  interacted: types.boolean,
  createdAt: types.string,
  updatedAt: types.string,
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
    imageFiles: types.optional(types.array(types.frozen()), []),
    gender: types.optional(types.enumeration("Gender", ["male", "female", "other"]), "other"),
    description: types.maybeNull(types.string),
    firstName: types.maybeNull(types.string),
    lastName: types.maybeNull(types.string),
    matchQueue: types.array(MatchQueueModel),
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
    setImageFiles(imageFiles: SnapshotOrInstance<typeof ImageDataModel>[]) {
      self.imageFiles = cast(imageFiles)
    },
    setNeighborhood(neighborhood: string) {
      self.neighborhood = neighborhood
    },
    setSport(squash_level: string) {
      self.sport = [{sportName: "squash", gameLevel: squash_level}]
    },
    setDescription(description: string) {
      self.description = description
    },
    setID(_id: string) {
      self._id = _id
    },
    setFromMongoDb(userData){
      self.email = userData.email
      self.age = userData.age
      self.phoneNumber = userData.phoneNumber
      self.sport = userData.sport
      self.firstName = userData.firstName
      self.lastName = userData.lastName
      self.gender = userData.gender
      self.imageFiles = cast(userData.image_set)
      self.neighborhood = userData.neighborhood
      self.description = userData.description
      self.matchQueue = userData.matchQueue
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

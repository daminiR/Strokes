import { types, IType, flow, cast, SnapshotOrInstance, SnapshotOut, Instance, getRoot} from 'mobx-state-tree';
import { getRootStore } from './helpers/getRootStore';

export const ImageModel = types.model("ImageModel", {
  img_idx: types.maybeNull(types.number),
  imageURL: types.maybeNull(types.string),
});
const GameLevelModel = types.model({
  gameLevel: types.maybeNull(types.number),
  sportName: types.maybeNull(types.string),
})
const NeighborhoodModel = types.model({
  city: types.maybeNull(types.string),
  state: types.maybeNull(types.string),
  country: types.maybeNull(types.string),
})

export const LikedUserType = types.model("LikedUserType", {
  matchUserId: types.maybeNull(types.string),
  firstName: types.maybeNull(types.string),
  imageSet: types.array(ImageModel),
  age: types.maybeNull(types.integer),
  neighborhood: types.maybeNull(NeighborhoodModel),
  gender: types.optional(types.enumeration("Gender", ["male", "female", "other"]), "other"),
  sport: types.maybeNull(GameLevelModel),
  description: types.maybeNull(types.string),
  createdAt: types.maybeNull(types.string),
  updatedAt: types.maybeNull(types.string),
  interacted: types.optional(types.boolean, false),
  isBlurred: types.optional(types.boolean, false),
})

export const LikedUserStore = types
  .model("LikedUserStore", {
    likedProfiles: types.array(LikedUserType),
  })
  .actions((self) => ({
    appendLikedProfiles(newProfiles: any) {
      console.log("testing likes before", self.likedProfiles)
      self.likedProfiles.push(...newProfiles)
      console.log("testing likes after", self.likedProfiles)
    },
    addProfile(profile: any) {
      self.likedProfiles.push(profile)
    },
    clearProfiles() {
      self.likedProfiles.clear()
    },
    setProfiles(profiles: any) {
      self.likedProfiles.replace(profiles)
    },
  }))


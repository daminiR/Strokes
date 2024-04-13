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

export const LikedUserType = types.model("LikedUserType", {
    matchUserId: types.maybeNull(types.string),
    firstName: types.maybeNull(types.string),
    imageSet: types.maybeNull(types.string),
    age: types.maybeNull(types.integer),
    neighborhood: types.maybeNull(NeighborhoodModel),
    gender: types.optional(types.enumeration("Gender", ["male", "female", "other"]), "other"),
    sport: types.maybeNull(GameLevelModel),
    description: types.maybeNull(types.string),
    createdAt: types.maybeNull(types.string),
    updatedAt: types.maybeNull(types.string),
    interacted: types.optional(types.boolean, false),
    isBlurred: types.optional(types.boolean, false)
});

export const LikedUserStore = types
  .model("LikedUserStore", {
    likedProfiles: types.array(LikedUserType),
  })
  .actions((self) => ({
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


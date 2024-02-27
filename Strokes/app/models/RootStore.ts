import { Instance, SnapshotOut, types } from "mobx-state-tree"
import { UserStoreModel, AuthenticationStoreModel } from "./AuthenticationStore"
import { EpisodeStoreModel } from "./EpisodeStore"
import MongoDBStore from "./MongoDBStore"

/**
 * A RootStore model.
 */
export const RootStoreModel = types.model("RootStore").props({
  authenticationStore: types.optional(AuthenticationStoreModel, {}),
  userStore: types.optional(UserStoreModel, {}),
  mongoDBStore: types.optional(MongoDBStore, {}),
  episodeStore: types.optional(EpisodeStoreModel, {}),
})

/**
 * The RootStore instance.
 */
export interface RootStore extends Instance<typeof RootStoreModel> {}
/**
 * The data of a RootStore.
 */
export interface RootStoreSnapshot extends SnapshotOut<typeof RootStoreModel> {}

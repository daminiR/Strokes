import { Instance, SnapshotOut, types } from "mobx-state-tree"
import { AuthenticationStoreModel } from "./AuthenticationStore"
import { UserStoreModel } from "./UserStore"
import { TempStoreModel } from "./TempUserStore"
import { EpisodeStoreModel } from "./EpisodeStore"
import MatchesStoreModel from "./MatchesStore"
import MongoDBStore from "./MongoDBStore"
import { LikedUserStore } from "./LikedUserStore"
import { MatchedProfilesStore } from "./MatchedProfilesStore"
import { ChatStore } from "./ChatStore"

/**
 * A RootStore model.
 */
export const RootStoreModel = types.model("RootStore").props({
  authenticationStore: types.optional(AuthenticationStoreModel, {}),
  userStore: types.optional(UserStoreModel, {}),
  tempUserStore: types.optional(TempStoreModel, {}),
  mongoDBStore: types.optional(MongoDBStore, {}),
  episodeStore: types.optional(EpisodeStoreModel, {}),
  matchStore: types.optional(MatchesStoreModel, {}),
  likedUserStore: types.optional(LikedUserStore, {}),
  matchedProfileStore: types.optional(MatchedProfilesStore, {}),
  chatStore: types.optional(ChatStore, {}),
})

/**
 * The RootStore instance.
 */
export interface RootStore extends Instance<typeof RootStoreModel> {}
/**
 * The data of a RootStore.
 */
export interface RootStoreSnapshot extends SnapshotOut<typeof RootStoreModel> {}

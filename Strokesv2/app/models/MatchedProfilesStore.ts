import {types, flow, cast, SnapshotOrInstance, SnapshotOut, Instance, getRoot} from 'mobx-state-tree';

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

export const ChatModel = types.model("ChatModel", {
  channelUrl: types.maybeNull(types.string),
  channelType: types.maybeNull(types.string),
  channelStatus: types.maybeNull(types.string),
  lastMessagePreview: types.maybeNull(types.string),
  lastMessageTimestamp: types.maybeNull(types.string),
  unreadMessageCount: types.maybeNull(types.number),
  channelCreationDate: types.maybeNull(types.string),
  channelExpiryDate: types.maybeNull(types.string),
  readReceiptsStatus: types.maybeNull(types.boolean),
  reportedBy: types.maybeNull(types.string),
  blockedBy: types.maybeNull(types.string),
});

export const MatchedUserModel = types.model("MatchedUserModel", {
  matchId: types.maybeNull(types.string),
  matchedUserId: types.maybeNull(types.string),
  firstName: types.maybeNull(types.string),
  age: types.maybeNull(types.number),
  gender: types.maybeNull(types.string),
  sport: types.maybeNull(SportModel),
  description: types.maybeNull(types.string),
  imageSet: types.array(ImageModel),
  neighborhood: LocationModel,
  chat: types.maybeNull(ChatModel),
})

export const MatchedProfilesStore = types
  .model("MatchProfiles", {
    matchedProfiles: types.array(MatchedUserModel),
  })
  .actions((self) => ({
    findByChannelId(channelId) {
      return self.matchedProfiles.find((user) => user.chat.channelUrl === channelId)
    },
    removeMatchedProfile(matchId: String) {
      self.matchedProfiles.replace(
        self.matchedProfiles.filter((profile) => profile.matchId !== matchId),
      )
    },
    appendMatchedProfiles(newProfiles: any[]) {
      const transformedProfiles = newProfiles.map((profile) => {
        // Create a new object with all properties of the profile except _id
        const {_id, ...otherProps} = profile
        return {
          ...otherProps,
          matchedUserId: _id, // Assign _id value to matchUserId
        }
      })

      self.matchedProfiles.push(...transformedProfiles) // Append transformed profiles
    },
    setProfiles(newProfiles: any[]) {
      const transformedProfiles = newProfiles.map((profile) => {
        // Destructure the profile to separate _id and the rest of the properties
        const {_id, ...otherProps} = profile
        return {
          ...otherProps,
          matchedUserId: _id, // Assign _id value to matchUserId
        }
      })

      self.matchedProfiles.replace(transformedProfiles) // Replace the entire array with transformed profiles
    },
  }))

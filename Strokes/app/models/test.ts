
import {types} from "mobx-state-tree";
import {GroupChannelCollection} from "@sendbird/chat/groupChannel";
import {withSetPropAction} from "mobx-state-tree";

export const ChatStore = types
  .model({
    currentUser: types.maybe(UserModel),
    isConnected: types.optional(types.boolean, false),
    sdk: types.maybe(types.frozen()), // Store the SDK instance once initialized
    channelUrl: types.optional(types.frozen(), {}),
    collection: types.maybeNull(types.frozen<GroupChannelCollection>()), // Update to maybeNull and correct type
    currentChatProfile: types.maybe(CurrentChatModel),
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
  })
  .actions(withSetPropAction)
  .actions((self) => ({
    setChannel(channel: GroupChannel) {
      self.channelUrl = channel;
    },
    setChatProfile(profile: any) {
      self.currentChatProfile = {
        matchId: profile.matchId,
        matchedUserId: profile.matchedUserId || null,
        firstName: profile.firstName || null,
        age: profile.age || null,
        gender: profile.gender || null,
        sport: SportModel.create({
          sportName: profile.sport.sportName,
          gameLevel: profile.sport.gameLevel,
        }), // Handle nested models correctly
        description: profile.description || null,
        imageSet: profile.imageSet.map((img: any) =>
          ImageModel.create({
            img_idx: img.img_idx,
            imageURL: img.imageURL,
          })
        ),
        neighborhood: LocationModel.create({
          city: profile.neighborhood.city,
          state: profile.neighborhood.state,
          country: profile.neighborhood.country,
        }), // Provide a default model if null
      };

      // Set chat detail
      self.channelUrl = profile.chat.channelUrl || null;
      self.channelType = profile.chat.channelType || null;
      self.channelStatus = profile.chat.channelStatus || null;
      self.lastMessagePreview = profile.chat.lastMessagePreview || null;
      self.lastMessageTimestamp = profile.chat.lastMessageTimestamp || null;
      self.unreadMessageCount = profile.chat.unreadMessageCount || null;
      self.channelCreationDate = profile.chat.channelCreationDate || null;
      self.channelExpiryDate = profile.chat.channelExpiryDate || null;
      self.readReceiptsStatus = profile.chat.readReceiptsStatus || null;
      self.reportedBy = profile.chat.reportedBy || null;
      self.blockedBy = profile.chat.blockedBy || null;
    },
    setCollection(collection: GroupChannelCollection) {
      console.log("Setting collection in store");
      self.collection = collection;
    },
  }));


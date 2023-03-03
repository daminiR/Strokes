import Squash from '../models/Squash';
import _ from 'lodash'
import sanitize from 'mongo-sanitize'
import SendbirdPlatformSdk from 'sendbird-platform-sdk'
import { CHAT_TIMER } from '../constants'
const appId = "FFBBD532-7319-41BD-A32A-26F6D6BCA74C"

export const resolvers = {
  Query: {
    matchesNotOptim: async (
      parents,
      unSanitizedData,
      context,
      info
    ) => {
      const { _id, offset, limit, location, sport, game_levels, ageRange, dislikes } = sanitize(unSanitizedData)
      //const user = context.user;
      //if (user?.sub != _id) throw new AuthenticationError("not logged in");
      const minAge = ageRange.minAge;
      const maxAge = ageRange.maxAge;
      const filter = {
        $and: [
          {
            _id: { $ne: _id },
          },
          {
            "location.city": location.city,
          },
          {
            "likes._id": { $ne: _id },
          },
          {
            active: true,
          },
          {
            //sports: { sport: sport, game_level: { $in: game_levels  } },
            sports: {
              $elemMatch: { sport: sport, game_level: { $in: ["2", "0"] } },
            },
          },
          {
            age: { $gt: minAge, $lt: maxAge },
          },
        ],
      };
      const users = await Squash.find(filter).skip(offset).limit(limit);
      console.log(
        "All users that are a potential match to current!",
        users.length
      );
      return users;
    },
    queryProssibleMatches: async (
      parents,
      unSanitizedData,
      context,
      info
    ) => {
      const { _id, offset, limit, location, sport, game_levels, ageRange } = sanitize(unSanitizedData)
      const minAge = ageRange.minAge;
      const maxAge = ageRange.maxAge;
      const filter = {
        $and: [
          {
            _id: { $ne: _id },
          },
          {
            "location.state": location.state,
          },
          {
            active: true,
          },
          {
            sports: {
              $elemMatch: { sport: sport, game_level: { $in: game_levels } },
            },
          },
          {
            age: { $gt: minAge, $lt: maxAge },
          },
        ],
      };
      const fieldsNeeded = {
        _id: 1,
        first_name: 1,
        age: 1,
        gender: 1,
        sports: 1,
        description: 1,
        image_set: 1,
        location: 1,
      };
      const users = await Squash.find(filter, fieldsNeeded)
        .skip(offset)
        .limit(limit);
      console.log(users)
      return users;
    },
  },
  Mutation: {
    updateMatches: async (
      parents,
      unSanitizedData,
      context,
      info
    ) => {
      const { currentUserId, potentialMatchId, currentUser, potentialMatch } =
        sanitize(unSanitizedData);
      //const chat_timer = 1.21e+9
      //two days
      const unix = Date.now() - CHAT_TIMER;
      // note: don't need to update matches archives for potential match because
      //that needs to be on the potential matches server load on their id
      await Squash.findOneAndUpdate(
        { _id: currentUserId },
        { $set: { "matches.$[elem].archived": true } },
        { arrayFilters: [{ "elem.createdAt": { $lte: unix } }], new: true }
      );
      await Squash.findOneAndUpdate(
        { _id: currentUserId },
        { $addToSet: { matches: potentialMatch } },
        { new: true }
      );
      const potentialMatchDoc = await Squash.findOneAndUpdate(
        { _id: potentialMatchId },
        { $push: { matches: currentUser } },
        { new: true }
      );
      //const userId = "";
      //const name = "Damini";
      //const apiToken = "2abd56b4db65e8b6b1ef447bb79e10fb894922fd"
      //const appId = "FFBBD532-7319-41BD-A32A-26F6D6BCA74C";
      //const opts = {
        //createUserData: new SendbirdPlatformSdk.CreateUserData(
          //userId,
          //name,
          //profileUrl
        //),
      //};
      //async function createUser() {
        //const userApiInstance = new SendbirdPlatformSdk.UserApi();
        //userApiInstance.apiClient.basePath = `https://api-${appId}.sendbird.com`;
        //try {
          //const data = await userApiInstance.createUser(apiToken, opts);
          //console.log(data);
        //} catch (e) {
          //console.log(e);
        //}
      //}
      //createUser();
      //and lastly send messge to both notification!
      const apiInstance = new SendbirdPlatformSdk.MessageApi()
      const apiToken = "2abd56b4db65e8b6b1ef447bb79e10fb894922fd"
      //const channelType = "channelType_example";
      //const channelUrl = "channelUrl_example";
      let opts = {
        gcCreateChannelData: new SendbirdPlatformSdk.GcCreateChannelData(),
        user_ids: [
          "kbuxkjrqjwrxlnpetyelnntexbxy",
          "3708d089-3938-4160-80b3-fb0963b58914",
        ],
      };
      apiInstance.gcCreateChannel(apiToken, opts).then(
        (data) => {
          console.log("API called successfully. Returned data: " + data);
        },
        (error) => {
          console.error(error);
        }
      );
      //let opts = {
      //'sendMessageData': new SendbirdPlatformSdk.SendMessageData() // SendMessageData |
      //};
      //apiInstance.sendMessage(apiToken, channelType, channelUrl, opts).then((data) => {
      //console.log('API called successfully. Returned data: ' + data);
      //}, (error) => {
      //console.error(error);
      //});
      return potentialMatchDoc;
    },
  },
};

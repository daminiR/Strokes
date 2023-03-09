import Squash from '../models/Squash';
import _ from 'lodash'
import sanitize from 'mongo-sanitize'
import { CHAT_TIMER } from '../constants'
import {getMatchedUserToken, sendAdminMatchMessages, createGroupChannel} from '../utils'
import axios from 'axios'

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
            _id: "ba98a8c9-5939-4418-807b-320fdc0e0fec",
          },
          //{
            //_id: { $ne: _id },
          //},
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
      const trieal = await Squash.findOneAndUpdate(
        { _id: currentUserId },
        { $set: { "matches.$[elem].archived": true } },
        { arrayFilters: [{ "elem.createdAt": { $lte: unix } }], new: true }
      );
      createGroupChannel(currentUserId, potentialMatchId)
        .then(async (channel_response) => {
          const currentDoc = await Squash.findOneAndUpdate(
            { _id: currentUserId },
            { $addToSet: { matches: potentialMatch } },
            { new: true }
          );
          const potentialMatchDoc = await Squash.findOneAndUpdate(
            { _id: potentialMatchId },
            { $push: { matches: currentUser } },
            { new: true }
          );
          getMatchedUserToken(potentialMatchId)
            .then((matchUserToken) => {
              if (matchUserToken !== undefined || matchUserToken !== null) {
                sendAdminMatchMessages(
                  channel_response,
                  trieal?.first_name,
                  matchUserToken[0],
                  potentialMatchId
                )
                  .then(() => {
                    console.log("succesfull push");
                  })
                  .catch((err) => {
                    console.log(err);
                    console.log("did not push notify");
                  });
              }
              return potentialMatchDoc;
            })
            .catch((err) => {
              console.log(err);
              return trieal;
            });
        })
        .catch((err) => {
          console.log(err);
          return trieal;
        });
    },
  },
};

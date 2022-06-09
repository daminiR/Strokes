import Squash from '../models/Squash';
import _ from 'lodash'
import sanitize from 'mongo-sanitize'
import { AuthenticationError }  from 'apollo-server-express';
export const resolvers = {
  Query: {
    matchesNotOptim: async (
      parents,
      unSanitizedData,
      context,
      info
    ) => {
      const { _id, offset, limit, location, sport, game_levels, ageRange, dislikes } = sanitize(unSanitizedData)
      const user = context.user;
      if (user?.sub != _id) throw new AuthenticationError("not logged in");
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
      const user = context.user;
      if (user?.sub != _id) throw new AuthenticationError("not logged in");
      //// it is imperitive all the filter items are indexed!
      console.log("why matches erro", _id)
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
            active: true,
          },
          //{
            //sports: {
              //$elemMatch: { sport: sport, game_level: { $in: game_levels } },
            //},
          //},
          //{
            //age: { $gt: minAge, $lt: maxAge },
          //},
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
      const { currentUserId, potentialMatchId, currentUser, potentialMatch } = sanitize(unSanitizedData)
      const user = context.user;
      if (user?.sub != currentUserId) throw new AuthenticationError("not logged in");
      const doc = await Squash.findOneAndUpdate(
        { _id: currentUserId },
        { $addToSet: { matches: potentialMatch } },
        { new: true }
      );
      const potentialMatchDoc = await Squash.findOneAndUpdate(
        { _id: potentialMatchId },
        { $push: { matches: currentUser } },
        { new: true }
      );
      return potentialMatchDoc;
    },
  },
};

import Squash from '../../models/Squash';
import _ from 'lodash'
import sanitize from 'mongo-sanitize'
import { CHAT_TIMER } from '../../constants'
import {getMatchedUserToken, sendAdminMatchMessages, createGroupChannel} from '../../utils'
import axios from 'axios'

export const resolvers = {
  Query: {
    matchesNotOptim: async (parents, unSanitizedData, context, info) => {
      const {
        _id,
        offset,
        limit,
        location,
        sport,
        gameLevelRange,
        ageRange,
        dislikes,
      } = sanitize(unSanitizedData);
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
    queryProssibleMatches: async (parents, unSanitizedData, context, info) => {
      const { _id, offset, limit, location, gameLevelRange, ageRange } =
        sanitize(unSanitizedData);
      const minAge = ageRange.min;
      const maxAge = ageRange.max;

      // Retrieve the user by _id to access their matchQueue
      const currentUser = await Squash.findById(_id);

      if (!currentUser) {
        console.log(`User with ID ${_id} not found`);
        return [];
      }

      // Filter matchQueue for interacted being false
      const matchQueueIds = currentUser.matchQueue
        .filter((match) => !match.interacted)
        .map((match) => match._id);

      // Define a filter to fetch users by IDs in the filtered matchQueue and within the age range
      const filter = {
        _id: { $in: matchQueueIds },
        age: { $gte: minAge, $lte: maxAge },
        // Add additional filters as needed (e.g., for gameLevelRange or location)
      };

      const fieldsNeeded = {
        _id: 1,
        firstName: 1,
        age: 1,
        gender: 1,
        sport: 1,
        description: 1,
        image_set: 1,
        neighborhood: 1,
      };

      // Fetch potential matches based on the criteria
      const users = await Squash.find(filter, fieldsNeeded)
        .skip(offset)
        .limit(limit)
        .exec(); // Ensure the query is executed

      console.log(users);
      return users;
    },
  },
  Mutation: {
    updateMatches: async (parents, unSanitizedData, context, info) => {
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
          getMatchedUserToken(potentialMatchId)
            .then((matchUserToken) => {
              sendAdminMatchMessages(
                channel_response,
                trieal?.firstName,
                matchUserToken
              );
            })
            .catch((err) => {
              console.log(err);
            });
          return potentialMatchDoc;
        })
        .catch((err) => {
          console.log(err);
          return trieal;
        });
    },
  },
};

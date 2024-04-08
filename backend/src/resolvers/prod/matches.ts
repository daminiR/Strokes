import User from '../../models/User';
import _ from 'lodash'
import sanitize from 'mongo-sanitize'
import { CHAT_TIMER } from '../../constants'
import {getMatchedUserToken, sendAdminMatchMessages, createGroupChannel} from '../../utils'

export const resolvers = {
  Query: {
    fetchNonInteractedMatches: async (
      parents,
      unSanitizedData,
      context,
      info
    ) => {
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
      const users = await User.find(filter).skip(offset).limit(limit);
      console.log(
        "All users that are a potential match to current!",
        users.length
      );
      return users;
    },
    fetchFilteredMatchQueue: async (
      parents,
      unSanitizedData,
      context,
      info
    ) => {
      const { _id } = sanitize(unSanitizedData);

      try {
        // Ensure _id is valid, otherwise throw an error
        if (!_id) throw new Error("Invalid user ID");

        const currentUser = await User.findById(_id)
          .select("matchQueue lastFetched")
          .exec();
        if (!currentUser) throw new Error(`User with ID ${_id} not found`);
        if (!Array.isArray(currentUser.matchQueue))
          throw new Error("matchQueue is not an array");

        const nonInteractedIds = currentUser.matchQueue
          .filter((match) => !match.interacted && match._id) // Ensure match._id is present
          .map((match) => match._id);
        if (nonInteractedIds.length === 0) {
          console.log("No non-interacted matches found in matchQueue");
          return [];
        }
        console.log(nonInteractedIds);

        const fieldsNeeded =
          "firstName age gender sport description image_set neighborhood";

        const userProfiles = await User.find({
          _id: { $in: nonInteractedIds },
        })
          .select(fieldsNeeded)
          .exec();

        const potentialMatches = userProfiles.map((user) => ({
          _id: user._id,
          firstName: user.firstName,
          image_set: user.image_set,
          age: user.age,
          archived: false, // Assuming default false as no archived info in find
          neighborhood: user.neighborhood,
          gender: user.gender,
          sport: user.sport,
          createdAt: Date.now(), // Assuming createdAt is a Date object
          updatedAt: Date.now(), // Assuming updatedAt is a Date object
          description: user.description,
        }))
        return {
          potentialMatches: potentialMatches,
          lastFetched: currentUser.lastFetched,
        };      } catch (error) {
        // More granular error handling based on error type
        if (error instanceof TypeError) {
          console.error("TypeError occurred:", error.message);
        } else if (error instanceof TypeError) {
          // Handle specific errors if you expect them
          console.error("Specific error occurred:", error.message);
        } else {
          console.error("An unknown error occurred");
        }
        throw new Error("Failed to fetch filtered match queue");
      }
    },
  },
  Mutation: {
    updateMatches: async (parents, unSanitizedData, context, info) => {
      const { currentUserId, potentialMatchId, currentUser, potentialMatch } =
        sanitize(unSanitizedData);
      const unix = Date.now() - CHAT_TIMER;
      const trieal = await User.findOneAndUpdate(
        { _id: currentUserId },
        { $set: { "matches.$[elem].archived": true } },
        { arrayFilters: [{ "elem.createdAt": { $lte: unix } }], new: true }
      );
      createGroupChannel(currentUserId, potentialMatchId)
        .then(async (channel_response) => {
          await User.findOneAndUpdate(
            { _id: currentUserId },
            { $addToSet: { matches: potentialMatch } },
            { new: true }
          );
          const potentialMatchDoc = await User.findOneAndUpdate(
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

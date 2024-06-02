import User from "../../../models/User";
import { PotentialMatchPool } from "../../../models/PotentialMatchPool";
import _ from 'lodash'
import sanitize from 'mongo-sanitize'
import { CHAT_TIMER } from "../../../constants";
import {
  getMatchedUserToken,
  sendAdminMatchMessages,
  createGroupChannel,
} from "../../../utils";

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

        // Query the PotentialMatchPool collection for the current user's potential matches
        const matchPoolDoc = await PotentialMatchPool.findOne({
          userId: _id,
        }).exec();
        if (!matchPoolDoc)
          throw new Error(`Match pool for user with ID ${_id} not found`);

        // Check if swipesPerDay is less than or equal to 0, return an empty array if true
        if (matchPoolDoc.swipesPerDay <= 0) {
          return {
            potentialMatches: [],
            lastUpdated: matchPoolDoc.lastUpdated,
            filters: matchPoolDoc.filters,
            filtersHash: matchPoolDoc.filtersHash,
            dislikes: matchPoolDoc.dislikes,
          };
        }

        // Proceed with filtering matches that have not been interacted with
        const potentialMatches = matchPoolDoc.potentialMatches
          .filter((match) => !match.interacted)
          .map((match) => ({
            matchUserId: match.matchUserId,
            firstName: match.firstName,
            imageSet: match.imageSet,
            age: match.age,
            neighborhood: match.neighborhood,
            gender: match.gender,
            sport: match.sport,
            createdAt: match.createdAt,
            updatedAt: match.updatedAt,
            description: match.description,
            interacted: match.interacted,
          }));
        return {
          potentialMatches:  potentialMatches,
          lastUpdated:  new Date(),
          filters:  matchPoolDoc.filters,
          filtersHash:  matchPoolDoc.filtersHash,
          dislikes: matchPoolDoc.dislikes

        };
      } catch (error) {
        if (error instanceof Error) {
          console.error("Error fetching filtered match queue:", error.message);
          throw new Error(
            "Failed to fetch filtered match queue: " + error.message
          );
        } else {
          console.error("An unexpected error occurred:", error);
          throw new Error(
            "Failed to fetch filtered match queue due to an unexpected error."
          );
        }
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

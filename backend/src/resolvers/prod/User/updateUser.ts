import User from "../../../models/User";
import { PotentialMatchPool } from "../../../models/PotentialMatchPool";
import mongoose from 'mongoose';
import _ from 'lodash'
import { manageImages } from "../../../utils/awsUpload";
import sanitize from 'mongo-sanitize'
import { filterMatches } from '../../../utils/matches';

export const resolvers = {
  Query: {
    getUserLimitsAndStats: async (_, { id }) => {
      try {
        const user = await User.findById(id).select(
          "_id visibleLikePerDay filtersChangesPerDay lastFetchedFromTrigger dislikes"
        );
        if (!user) {
          throw new Error("User not found");
        }
        return user; // The User model's structure should match the UserStats type definition
      } catch (error) {
        console.error("Error fetching user limits and stats:", error);
        throw error;
      }
    },
    fetchProfileById: async (parents, unSanitizedId, context, info) => {
      try {
        const { id } = sanitize(unSanitizedId);
        const userDocument = await User.findById(id);

        if (!userDocument) {
          console.error(`No user found with ID ${id}`);
          return null;
        }

        if (userDocument.matches) {
          const updatedUser = filterMatches(userDocument);
          console.log("Updated user with filtered matches", updatedUser);
          return updatedUser;
        }

        return userDocument;
      } catch (error) {
        // Check if error is an instance of Error
        if (error instanceof Error) {
          console.error(
            `Error fetching profile by ID: ${error.message}`,
            error
          );
          throw new Error("Failed to fetch user profile.");
        } else {
          // Handle unexpected errors, which might not be an instance of Error
          console.error("An unexpected error occurred:", error);
          throw new Error(
            "An unexpected error occurred while fetching user profile."
          );
        }
      }
    },

    fetchAllProfiles: async (parents, unSanitizedId, context, info) => {
      const { id } = sanitize(unSanitizedId);
      const squashes = await User.find({ id });
      return squashes;
    },
  },
  Mutation: {
    updateMatchQueueInteracted: async (
      _,
      { currentUserId, matchUserId, isLiked }
    ) => {
      try {
        // Fetch the current state of the PotentialMatchPool
        const currentPool = await PotentialMatchPool.findOne({
          userId: currentUserId,
        });

        if (!currentPool) {
          throw new Error("No match pool found for this user.");
        }

        // Check if matchUserId is already in the dislikes
        if (
          currentPool.dislikes &&
          currentPool.dislikes.some((dislike) => dislike._id === matchUserId)
        ) {
          // Set interacted to true for the disliked user before throwing error
          await PotentialMatchPool.updateOne(
            {
              userId: currentUserId,
              "potentialMatches.matchUserId": matchUserId,
            },
            { $set: { "potentialMatches.$[elem].interacted": true } },
            { arrayFilters: [{ "elem.matchUserId": matchUserId }] }
          );

          throw new Error("This user has already been disliked.");
        }

        // Prepare update operations
        let updateOperations = {
          $set: { "potentialMatches.$[elem].interacted": true },
          $inc: { swipesPerDay: -1 }, // Decrement swipes regardless of like or dislike
        };

        // If it's a dislike, update the dislikes array
        if (!isLiked) {
          updateOperations["$push"] = {
            dislikes: {
              createdAt: new Date(),
              updatedAt: new Date(),
              _id: matchUserId, // Assuming _id should be the ID of the disliked user
            },
          };
        }

        // Perform a single update operation
        const updateResult = await PotentialMatchPool.updateOne(
          {
            userId: currentUserId,
            "potentialMatches.matchUserId": matchUserId,
          },
          updateOperations,
          { arrayFilters: [{ "elem.matchUserId": matchUserId }] }
        );

        // After updating, fetch the updated details
        if (updateResult.matchedCount > 0 && updateResult.modifiedCount > 0) {
          const updatedUser = await PotentialMatchPool.findOne({
            userId: currentUserId,
          });
          if (updatedUser) {
            const uninteractedMatches = updatedUser.potentialMatches.filter(
              (match) => !match.interacted
            );
            return {
              success: true,
              message: "MatchQueue and swipesPerDay updated successfully",
              data: {
                potentialMatches: uninteractedMatches, // Only potential matches that haven't been interacted with
                dislikes: updatedUser.dislikes,
              },
            };
          }
        } else {
          return {
            success: false,
            message:
              "Failed to update the interacted status or decrement swipes",
          };
        }
      } catch (error) {
        console.error(error);
        // Check if error is an instance of Error
        if (error instanceof Error) {
          return {
            success: false,
            message: "Failed to update MatchQueue: " + error.message,
          };
        }
         else {
          // Handle unexpected errors, which might not be an instance of Error
          console.error("An unexpected error occurred:", error);
          throw new Error(
            "An unexpected error occurred while updating potential match pool."
          );
        }
    }
    },
    applyFilters: async (root, unSanitizedData, context) => {
      const {
        _id, // User ID
        filters, // New filters object provided by the user
        filtersHash, // Provided hash of the user's filters
      } = unSanitizedData;

      const session = await mongoose.startSession();
      await session.startTransaction();

      let updatedPoolDoc = null; // Initialize a variable to hold the updated PotentialMatchPool document

      try {
        // Fetch the current user's PotentialMatchPool document
        const currentPool = await PotentialMatchPool.findOne({
          userId: _id,
        }).session(session);
        if (!currentPool) {
          throw new Error("PotentialMatchPool not found for the user.");
        }

        // Exit early if the user has no swipes left for the day
        if (currentPool.swipesPerDay <= 0) {
          console.log("User has exhausted the daily swipes limit.");
          await session.abortTransaction();
          return null;
        }

        // Only proceed if the provided filtersHash is different from the stored one
        if (filtersHash !== currentPool.filtersHash) {
          const matchCriteria = {
            _id: { $ne: _id },
            age: { $gte: filters.ageRange.min, $lte: filters.ageRange.max },
            "sport.gameLevel": {
              $gte: filters.gameLevelRange.min,
              $lte: filters.gameLevelRange.max,
            },
          };

          // Find potential matches based on the new filters
          const potentialMatches = await User.aggregate([
            { $match: matchCriteria },
            { $sample: { size: 30 } }, // Randomly select 30 users to be potential matches
          ]).session(session);

          const currentDate = new Date();

          // Prepare the potentialMatches array for the PotentialMatchPool document
          const updatedPotentialMatches = potentialMatches.map((match) => ({
            matchUserId: match._id.toString(), // Convert ObjectId to string if necessary
            firstName: match.firstName, // Assuming these fields are directly available from the aggregation
            image_set: match.image_set, // This should match the ImageSet[] structure
            age: match.age,
            neighborhood: match.neighborhood, // Ensure this matches the Neighborhood structure
            gender: match.gender,
            sport: match.sport, // Ensure this matches the Sport structure
            description: match.description, // Optional in your interface, so it's fine if it's not present in some documents
            createdAt: currentDate, // Set to current time, assuming this is a new match being added
            updatedAt: currentDate, // Also set to current time for the same reason
            interacted: false, // Since these are new potential matches, interacted should initially be false
          }));
          // Update the PotentialMatchPool document with the new filters, filtersHash, and potential matches
          updatedPoolDoc = await PotentialMatchPool.findOneAndUpdate(
            { userId: _id },
            {
              $set: {
                filters: filters,
                filtersHash: filtersHash,
                potentialMatches: updatedPotentialMatches,
              },
              $inc: { swipesPerDay: -1 },
            },
            { new: true, session }
          );
        }

        await session.commitTransaction();
        return updatedPoolDoc;
      } catch (error) {
        await session.abortTransaction();
        console.error("Failed to apply filters:", error);
        throw error;
      } finally {
        await session.endSession();
      }
    },

    updateProfile: async (root, unSanitizedData, context) => {
      const {
        _id,
        firstName,
        lastName,
        gender,
        age,
        sport,
        neighborhood,
        description,
        addLocalImages,
        removeUploadedImages,
        originalImages,
      } = unSanitizedData;
      const session = await mongoose.startSession();
      session.startTransaction();
      try {
        // Handling image removal from AWS and constructing the new image set
        const currentSquashProfile = await User.findById(_id).session(session);
        if (!currentSquashProfile) {
          throw new Error("User profile not found.");
        }
        const final_image_set = await manageImages(
          addLocalImages,
          removeUploadedImages,
          originalImages,
          _id
        );
        // Updating the Squash model
        const updatedProfile = await User.findOneAndUpdate(
          { _id: _id },
          {
            firstName,
            lastName,
            gender,
            age,
            sport,
            neighborhood,
            description,
            image_set: final_image_set,
            // Include other fields as necessary
          },
          { new: true, session }
        );
        await session.commitTransaction();
        return updatedProfile;
      } catch (error) {
        await session.abortTransaction();
        throw error; // Re-throw the error for external handling
      } finally {
        session.endSession();
      }
    },
  },
};

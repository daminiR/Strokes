import User from '../../models/User';
import mongoose from 'mongoose';
import _ from 'lodash'
import { manageImages } from "../../utils/awsUpload";
import sanitize from 'mongo-sanitize'
import { filterMatches } from '../../utils/matches';

export const resolvers = {
  Query: {
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
    applyFilters: async (root, unSanitizedData, context) => {
      const {
        _id,
        preferences, // The new preferences object
        preferencesHash, // Provided in unSanitizedData
      } = unSanitizedData;

      const session = await mongoose.startSession();
      await session.startTransaction();

      let updatedDoc = null; // Initialize a variable to hold the updated document

      try {
        const currentUser = await User.findById(_id).session(session);
        if (!currentUser) {
          throw new Error("User not found.");
        }
        // Check if filtersChangesPerDay is less than 0, if so, exit early
        if (currentUser.filtersChangesPerDay < 0) {
          console.log(
            "User has exceeded the daily limit for changing filters."
          );
          await session.abortTransaction(); // It's important to abort the transaction since we're exiting early
          return null; // Indicate that no update was performed due to the limit
        }

        if (preferencesHash !== currentUser.preferencesHash) {
          const matchCriteria = {
            _id: { $ne: _id },
            age: { $gte: preferences.age.min, $lte: preferences.age.max },
            "sport.gameLevel": {
              $gte: preferences.gameLevel.min,
              $lte: preferences.gameLevel.max,
            },
          };

          const potentialMatches = await User.aggregate([
            { $match: matchCriteria },
            { $sample: { size: 30 } }, // Randomly select 30 users
          ]).session(session);

          const currentDate = new Date();

          if (potentialMatches && Array.isArray(potentialMatches)) {
            const matchQueue = potentialMatches
              .filter((match) => match._id) // Ensure there's an _id
              .map((match) => ({
                _id: match._id,
                interacted: false,
                createdAt: currentDate,
                updatedAt: currentDate,
              }));

            updatedDoc = await User.findOneAndUpdate(
              { _id: _id },
              {
                $set: {
                  preferences: preferences,
                  preferencesHash: preferencesHash,
                  matchQueue: matchQueue,
                  lastFetched: currentDate,
                },
                $inc: { filtersChangesPerDay: -1 },
              },
              { new: true, session }
            );
          } else {
            console.log(
              "No potential matches found or potentialMatches is not an array"
            );
          }
        }

        await session.commitTransaction();
        console.log(updatedDoc);
        return updatedDoc; // Return the updated document (or null if no updates were made)
      } catch (error) {
        await session.abortTransaction();
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

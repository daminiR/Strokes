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

      try {
        const currentUser = await User.findById(_id).session(session);
        if (!currentUser) {
          throw new Error("User not found.");
        }

        if (preferencesHash !== currentUser.preferencesHash) {
          // Define the match criteria based on the updated preferences
          const matchCriteria = {
            _id: { $ne: _id },
            age: { $gte: preferences.age.min, $lte: preferences.age.max },
            "sport.gameLevel": {
              $gte: preferences.gameLevel.min,
              $lte: preferences.gameLevel.max,
            },
          };

          // Fetch potential matches based on criteria
          const potentialMatches = await User.aggregate([
            { $match: matchCriteria },
            { $sample: { size: 30 } }, // Randomly select 30 users
          ]).session(session);

          const currentDate = new Date();

          if (potentialMatches && Array.isArray(potentialMatches)) {
            const matchQueue = potentialMatches
              .filter((match) => match._id) // Ensure there's an _id to avoid adding empty objects
              .map((match) => ({
                _id: match._id, // Using the _id from the matched documents
                interacted: false, // Default value for new entries
                createdAt: currentDate, // Set to the current date
                updatedAt: currentDate, // Set to the current date
              }));

            // Update the user document with the new preferences, preferencesHash, and matchQueue
            await User.findOneAndUpdate(
              { _id: _id },
              {
                preferences: preferences,
                preferencesHash: preferencesHash,
                matchQueue: matchQueue,
                lastFetched: currentDate,
              },
              { new: true, session }
            );
          } else {
            console.log(
              "No potential matches found or potentialMatches is not an array"
            );
          }
          await session.commitTransaction();
        } else {
          // Commit the transaction to close it properly even if no update is made
          await session.commitTransaction();
        }
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

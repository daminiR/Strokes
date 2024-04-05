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

import User from '../../models/User';
import mongoose from 'mongoose';
import _ from 'lodash'
import { manageImages } from "../../utils/awsUpload";
import sanitize from 'mongo-sanitize'
import { filterMatches } from '../../utils/matches';

export const resolvers = {
  Query: {
    fetchProfileById: async (parents, unSanitizedId, context, info) => {
      const { id } = sanitize(unSanitizedId);
      // change matches to only get matches that are beyond certain dates
      var squash_val = await User.findById(id);
      if (squash_val) {
        if (squash_val.matches) {
          const new_squash = filterMatches(squash_val);
          return new_squash;
        }
      }
      return squash_val;
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
        originalImages
      } = unSanitizedData;


      const session = await mongoose.startSession();
      session.startTransaction();

      try {
        // Handling image removal from AWS and constructing the new image set
        const currentSquashProfile = await User.findById(_id).session(
          session
        );
        if (!currentSquashProfile) {
          throw new Error("User profile not found.");
        }
         const  final_image_set = await manageImages(
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

import Squash from '../../models/Squash';
import mongoose from 'mongoose';
import _ from 'lodash'
import { manageImages } from "../../utils/awsUpload";
import sanitize from 'mongo-sanitize'
import { filterMatches } from '../../utils/matches';

export const resolvers = {
  Query: {
    squash: async (parents, unSanitizedId, context, info) => {
      const { id } = sanitize(unSanitizedId);
      // change matches to only get matches that are beyond certain dates
      console.log(unSanitizedId);
      var squash_val = await Squash.findById(id);
      if (squash_val) {
        if (squash_val.matches) {
          const new_squash = filterMatches(squash_val);
          console.log(new_squash);
          return new_squash;
        }
      }
      return squash_val;
    },
    squashes: async (parents, unSanitizedId, context, info) => {
      //const user = context.user;
      const { id } = sanitize(unSanitizedId);
      //if (user?.sub != id) throw new AuthenticationError("not logged in");
      const squashes = await Squash.find({ id });
      return squashes;
    },
  },
  Mutation: {
    updateUserProfile: async (root, unSanitizedData, context) => {
      // Assuming context provides user authentication details
      //const userId = context.isAuthenticated(); // Adjust according to your authentication logic
      //if (!userId) {
        //throw new Error("Unauthorized");
      //}
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

      //if (userId !== _id) {
        //throw new Error("Unauthorized: You can only update your own profile.");
      //}

      const session = await mongoose.startSession();
      session.startTransaction();

      try {
        // Handling image removal from AWS and constructing the new image set
        const currentSquashProfile = await Squash.findById(_id).session(
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
        const updatedProfile = await Squash.findOneAndUpdate(
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

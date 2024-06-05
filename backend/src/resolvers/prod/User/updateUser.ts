import User from "../../../models/User";
import Like from '../../../models/Likes';
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
        const currentPool = await PotentialMatchPool.findOne({
          userId: currentUserId,
        });

        if (!currentPool) {
          throw new Error("No match pool found for this user.");
        }

        const matchExists = currentPool.potentialMatches.some(
          (match) => match.matchUserId === matchUserId
        );

        // Early update for dislikes if user is not liked and not in potentialMatches
        if (!isLiked && !matchExists) {
          await PotentialMatchPool.updateOne(
            { userId: currentUserId },
            {
              $push: {
                dislikes: {
                  _id: matchUserId,
                  createdAt: new Date(),
                  updatedAt: new Date(),
                },
              },
            }
          );

          return {
            success: true,
            message:
              "User added to dislikes successfully, no match in potential matches to update.",
            data: {
              potentialMatches: currentPool.potentialMatches.filter(
                (match) => !match.interacted
              ),
              dislikes: [
                ...currentPool.dislikes,
                {
                  _id: matchUserId,
                  createdAt: new Date(),
                  updatedAt: new Date(),
                },
              ],
            },
          };
        }

        if (matchExists) {
          let updateOperations = {
            $set: { "potentialMatches.$[elem].interacted": true },
            $inc: { swipesPerDay: -1 },
          };

          if (!isLiked) {
            updateOperations["$push"] = {
              dislikes: {
                _id: matchUserId,
                createdAt: new Date(),
                updatedAt: new Date(),
              },
            };
          }

          const updateResult = await PotentialMatchPool.updateOne(
            {
              userId: currentUserId,
              "potentialMatches.matchUserId": matchUserId,
            },
            updateOperations,
            { arrayFilters: [{ "elem.matchUserId": matchUserId }] }
          );

          const updatedUser = await PotentialMatchPool.findOne({
            userId: currentUserId,
          });

          if (!updatedUser) {
            return {
              success: false,
              message: "Failed to fetch updated user details.",
            };
          }

          return {
            success: true,
            message: "MatchQueue and swipesPerDay updated successfully",
            data: {
              potentialMatches: updatedUser.potentialMatches.filter(
                (match) => !match.interacted
              ),
              dislikes: updatedUser.dislikes,
            },
          };
        } else {
          // Handle case where matchUserId is not found and isLiked is true
          return {
            success: true,
            message: "No update needed, user not found in potential matches",
            data: {
              potentialMatches: currentPool.potentialMatches.filter(
                (match) => !match.interacted
              ),
              dislikes: currentPool.dislikes,
            },
          };
        }
      } catch (error) {
        console.error(error);
        if (error instanceof Error) {
          return {
            success: false,
            message: "Failed to update MatchQueue: " + error.message,
          };
        } else {
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
      try {
        await session.startTransaction();

        // Fetch the current user's PotentialMatchPool document
        const currentPool = await PotentialMatchPool.findOne({
          userId: _id,
        }).session(session);

        if (!currentPool) {
          await session.abortTransaction();
          throw new Error("PotentialMatchPool not found for the user.");
        }

        if (currentPool.swipesPerDay <= 0) {
          await session.abortTransaction();
          throw new Error("User has exhausted the daily swipes limit.");
        }

        if (filtersHash === currentPool.filtersHash) {
          await session.abortTransaction();
          return {
            ...currentPool.toObject(),
            potentialMatches: currentPool.potentialMatches,
          };
        }

        // Fetch all liked and disliked IDs
        const likes = await Like.find({ likerId: _id }, "likedId").session(
          session
        );
        const likedUserIds = likes.map((like) => like.likedId.toString());
        const dislikedUserIds = currentPool.dislikes.map((dislike) =>
          dislike._id.toString()
        );

        const excludeUserIds = [...likedUserIds, ...dislikedUserIds];

        const matchCriteria = {
          _id: { $nin: excludeUserIds, $ne: _id },
          age: { $gte: filters.age.min, $lte: filters.age.max },
          "sport.gameLevel": {
            $gte: filters.gameLevel.min,
            $lte: filters.gameLevel.max,
          },
        };

        // Find potential matches based on the new filters
        const potentialMatches = await User.aggregate([
          { $match: matchCriteria },
          { $sample: { size: currentPool.swipesPerDay } },
        ]).session(session);

        const currentDate = new Date().toISOString();

        // Update the PotentialMatchPool document
        const updatedPoolDoc = await PotentialMatchPool.findOneAndUpdate(
          { userId: _id },
          {
            $set: {
              filters: filters,
              filtersHash: filtersHash,
              potentialMatches: potentialMatches.map((match) => ({
                matchUserId: match._id.toString(),
                firstName: match.firstName,
                imageSet: match.imageSet,
                age: match.age,
                neighborhood: match.neighborhood,
                gender: match.gender,
                sport: match.sport,
                description: match.description,
                createdAt: currentDate,
                updatedAt: currentDate,
                interacted: false,
              })),
              //lastUpdated: currentDate,
            },
            $inc: { filtersPerDay: -1 },
          },
          { new: true, session }
        );

        if (!updatedPoolDoc) {
          await session.abortTransaction();
          throw new Error(
            "Failed to update the match pool document. It might not exist or the query failed."
          );
        }

        await session.commitTransaction();
        return {
          potentialMatches: updatedPoolDoc.potentialMatches,
          //lastUpdated: updatedPoolDoc.lastUpdated,
          filtersHash: updatedPoolDoc.filtersHash,
          filters: updatedPoolDoc.filters,
          dislikes: updatedPoolDoc.dislikes,
        };
      } catch (error) {
        await session.abortTransaction();
        console.error("Failed to apply filters:", error);
        throw new Error(
          "Failed to apply filters due to internal server error."
        );
      } finally {
        session.endSession();
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
        const final_imageSet = await manageImages(
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
            imageSet: final_imageSet,
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

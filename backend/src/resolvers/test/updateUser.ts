import User from '../../models/User';
import Like from '../../models/Likes';
import Match from '../../models/Match';
import { PotentialMatchPool } from "../../models/PotentialMatchPool";
import _ from 'lodash'
import { SHA256 } from 'crypto-js';

interface LikeActionResult {
  likerId: string;
  likedId: string;
  success: boolean;
}

export const resolvers = {
  Mutation: {
    updatePlayerPreferencesTest: async () => {
      // Fetch all users. Consider using cursor or pagination if the dataset is large.
      const usersCursor = User.find().cursor();

      for (
        let userDoc = await usersCursor.next();
        userDoc != null;
        userDoc = await usersCursor.next()
      ) {
        const { _id } = userDoc;

        // Fetch the corresponding PotentialMatchPool document for the user
        const potentialMatchPoolDoc = await PotentialMatchPool.findOne({
          userId: _id,
        });

        if (!potentialMatchPoolDoc) {
          console.log(
            `No PotentialMatchPool found for user with ID ${_id}. Skipping.`
          );
          continue; // Skip to the next user if no corresponding PotentialMatchPool document is found
        }

        const { filters } = potentialMatchPoolDoc;

        // No need to reconstruct filters here, use them directly from the PotentialMatchPool document
        const filtersString = JSON.stringify(filters);
        const filtersHash = SHA256(filtersString).toString();

        // Update the PotentialMatchPool document with the new hash
        await PotentialMatchPool.updateOne(
          { userId: _id },
          {
            $set: {
              filtersHash: filtersHash, // Update the hash in the PotentialMatchPool document
            },
          }
        );
      }

      return {
        success: true,
        message:
          "Completed updating filtersHash in PotentialMatchPool for all users.",
      };
    },
    removeAllMatchesForUserTest: async (_, { userId }) => {
      try {
        // Remove all matches where the user is either user1Id or user2Id
        const removedMatches = await Match.deleteMany({
          $or: [{ user1Id: userId }, { user2Id: userId }],
        });

        // Construct a result summary
        const result = {
          removedMatchesCount: removedMatches.deletedCount,
          success: true,
          message: `Removed ${removedMatches.deletedCount} matches.`,
        };

        return result;
      } catch (error) {
        console.error("Error removing matches for user:", error);
        return {
          success: false,
          message: "Failed to remove matches.",
          removedMatchesCount: 0,
        };
      }
    },
    removeAllLikesForUserTest: async (_, { userId }) => {
      try {
        // Ensure the user exists
        const userExists = await User.exists({ _id: userId });
        if (!userExists) {
          throw new Error("User not found");
        }

        // Remove all likes where the user is the liker
        const removedAsLiker = await Like.deleteMany({ likerId: userId });

        // Remove all likes where the user is the liked
        const removedAsLiked = await Like.deleteMany({ likedId: userId });

        // Construct a result summary
        const result = {
          removedAsLikerCount: removedAsLiker.deletedCount,
          removedAsLikedCount: removedAsLiked.deletedCount,
          success: true,
          message: `Removed ${
            removedAsLiker.deletedCount + removedAsLiked.deletedCount
          } likes.`,
        };

        return result;
      } catch (error) {
        console.error("Error removing likes for user:", error);
        return {
          success: false,
          message: "Failed to remove likes.",
          removedAsLikerCount: 0,
          removedAsLikedCount: 0,
        };
      }
    },
    updatePotentialMatchesTest: async (_, { currentUserId }) => {
      try {
        // Fetch the current user
        const currentUser = await User.findById(currentUserId);
        if (!currentUser) {
          throw new Error("User not found");
        }

        // Fetch the user's potential match pool
        const potentialMatchPool = await PotentialMatchPool.findOne({
          userId: currentUserId,
        });
        if (!potentialMatchPool) {
          throw new Error(
            "Potential match pool not found for the current user"
          );
        }

        // Fetch user IDs that the current user has already liked
        const likes = await Like.find({ likerId: currentUserId });
        const likedUserIds = likes.map((like) => like.likedId);

        // Retrieve filters from the PotentialMatchPool, fall back to default if necessary
        const { age = { min: 18, max: 100 }, gameLevel = { min: 1, max: 10 } } =
          potentialMatchPool.filters || {};

        // Define match criteria excluding already liked users
        const matchCriteria = {
          _id: { $nin: likedUserIds, $ne: currentUserId },
          age: { $gte: age.min, $lte: age.max },
          "sport.gameLevel": { $gte: gameLevel.min, $lte: gameLevel.max },
        };

        // Fetch 30 random potential matches that meet the criteria
        const newPotentialMatches = await User.aggregate([
          { $match: matchCriteria },
          { $sample: { size: 30 } },
          {
            $project: {
              firstName: 1,
              image_set: 1,
              age: 1,
              neighborhood: 1,
              gender: 1,
              sport: 1,
              description: 1,
            },
          },
        ]);

        // Update the PotentialMatchPool document with new matches
        await PotentialMatchPool.updateOne(
          { userId: currentUserId },
          {
            $set: {
              potentialMatches: newPotentialMatches.map((match) => ({
                matchUserId: match._id,
                firstName: match.firstName,
                image_set: match.image_set,
                age: match.age,
                neighborhood: match.neighborhood,
                gender: match.gender,
                sport: match.sport,
                description: match.description,
                createdAt: new Date(),
                updatedAt: new Date(),
                interacted: false,
              })),
              lastUpdated: new Date(),
              swipesPerDay: 30,
            },
          },
          { upsert: true }
        );

        console.log(
          "Potential match pool updated with 30 new matches for the user."
        );
        return {
          success: true,
          message:
            "Potential match pool updated with 30 new matches for the user.",
        };
      } catch (error: unknown) {
        // Log the error with a generic message if it's not an instance of Error
        if (error instanceof Error) {
          console.error("Error updating potential matches:", error.message);
          return {
            success: false,
            message: error.message,
          };
        } else {
          console.error(
            "Error updating potential matches: An unknown error occurred."
          );
          return {
            success: false,
            message:
              "Failed to update potential matches due to an unknown error.",
          };
        }
      }
    },
    simulateRandomLikesTest: async (_, { currentUserId, randomize = true }) => {
      try {
        const currentUser = await User.findById(currentUserId);
        if (!currentUser) {
          throw new Error("User not found");
        }

        const potentialMatchPool = await PotentialMatchPool.findOne({
          userId: currentUserId,
        });
        if (!potentialMatchPool) {
          throw new Error(
            "Potential match pool not found for the current user"
          );
        }

        const potentialMatches = potentialMatchPool.potentialMatches;
        if (!potentialMatches || potentialMatches.length === 0) {
          throw new Error("No potential matches found for the current user");
        }

        const likeActionsResults: LikeActionResult[] = [];
        const numLikes = randomize
          ? Math.min(10, potentialMatches.length)
          : potentialMatches.length;

        for (let i = 0; i < numLikes; i++) {
          const index = randomize
            ? Math.floor(Math.random() * potentialMatches.length)
            : i;
          const randomMatch = potentialMatches[index];

          // Simulate a like from this potential match to the current user
          const likeActionResult = await Like.create({
            likerId: randomMatch.matchUserId,
            likedId: currentUserId,
          });

          likeActionsResults.push({
            likerId: randomMatch.matchUserId,
            likedId: currentUserId,
            success: !!likeActionResult,
          });
        }

        // Update the PotentialMatchPool document with the modified potentialMatches array if randomizing
        if (randomize) {
          await PotentialMatchPool.updateOne(
            { userId: currentUserId },
            { $set: { potentialMatches: potentialMatches } }
          );
        }

        return likeActionsResults;
      } catch (error) {
        console.error("Error simulating random likes:", error);
        throw new Error("Failed to simulate random likes.");
      }
    },
    manageUserInteractions: async (_, { currentUserId }) => {
      try {
        // Step 1: Remove all likes for the current user
        const likesRemovalResult =
          await resolvers.Mutation.removeAllLikesForUserTest(_, {
            userId: currentUserId,
          });
        if (!likesRemovalResult.success) {
          throw new Error(likesRemovalResult.message);
        }
        console.log(likesRemovalResult.message);

        // Step 2: Remove all matches for the current user
        const matchesRemovalResult =
          await resolvers.Mutation.removeAllMatchesForUserTest(_, {
            userId: currentUserId,
          });
        if (!matchesRemovalResult.success) {
          throw new Error(matchesRemovalResult.message);
        }
        console.log(matchesRemovalResult.message);

        // Step 3: Update the potential match pool for the current user
        const updateMatchesResult =
          await resolvers.Mutation.updatePotentialMatchesTest(_, {
            currentUserId: currentUserId,
          });
        if (!updateMatchesResult.success) {
          throw new Error(updateMatchesResult.message);
        }
        console.log(updateMatchesResult.message);

        // Step 4: Simulate random likes for the current user
        const randomLikesResult =
          await resolvers.Mutation.simulateRandomLikesTest(_, {
            currentUserId,
          });
        //if (!randomLikesResult.success) {
        //throw new Error(randomLikesResult.message);
        //}
        //console.log(randomLikesResult.message);

        return {
          success: true,
          message: "All interactions managed successfully.",
          likesRemovalResult,
          matchesRemovalResult,
          updateMatchesResult,
          randomLikesResult,
        };
      } catch (error) {
        console.error("Error managing user interactions:", error);
        const errorMessage =
          error instanceof Error ? error.message : "Unknown error occurred";

        // Ensuring that the error result structures are consistent with the expected output
        return {
          success: false,
          message: errorMessage,
          likesRemovalResult: { success: false, message: errorMessage },
          matchesRemovalResult: { success: false, message: errorMessage },
          updateMatchesResult: { success: false, message: errorMessage },
          randomLikesResult: {
            success: false,
            message: errorMessage,
            likes: [],
          }, // assuming likes is a required field in LikeActionResult
        };
      }
    },
  },
};

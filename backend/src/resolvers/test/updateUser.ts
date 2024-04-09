import User from '../../models/User';
import Like from '../../models/Likes';
import Match from '../../models/Match';
import sanitize from 'mongo-sanitize'
import _ from 'lodash'
import { SHA256 } from 'crypto-js';
interface LikeActionResult {
  likerId: string;
  likedId: string;
  success: boolean;
}


export const resolvers = {
  Mutation: {
    updatePlayerPreferencesTest: async (root, unSanitizedData, context) => {
      const { _id } = sanitize(unSanitizedData); // Sanitize only _id as preferences will be fetched from the doc
      const userDoc = await User.findOne({ _id: _id }).exec();
      if (userDoc !== null) {
        // Assuming preferences are already part of the userDoc
        const preferences = userDoc.preferences;

        // If you need to update preferences with new values from unSanitizedData, merge them here before hashing
        // Example: userDoc.preferences = { ...userDoc.preferences, ...newPreferences };
        // Then, stringify and hash

        const preferencesString = JSON.stringify(preferences);
        const preferencesHash = SHA256(preferencesString).toString();
        // Update the user document with the new preferencesHash
        const updatedDoc = await User.updateOne(
          { _id: _id },
          {
            $set: {
              preferencesHash: preferencesHash,
              // If you updated preferences above, make sure to also set them here
              // preferences: userDoc.preferences,
            },
          },
          { new: true }
        );
        return updatedDoc;
      } else {
        throw new Error("User not found");
      }
    },
        removeAllMatchesForUserTest: async (_, { userId }) => {
      try {
        // Remove all matches where the user is either user1Id or user2Id
        const removedMatches = await Match.deleteMany({
          $or: [{ user1Id: userId }, { user2Id: userId }]
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
          message: `Removed ${removedAsLiker.deletedCount + removedAsLiked.deletedCount} likes.`,
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
    simulateRandomLikesTest: async (_, { currentUserId }) => {
      try {
        const currentUser = await User.findById(currentUserId);
        if (!currentUser || !currentUser.matchQueue) {
          throw new Error("User not found or matchQueue is empty");
        }

        const matchQueue = currentUser.matchQueue;
        const likeActionsResults = [];

        for (let i = 0; i < Math.min(10, matchQueue.length); i++) {
          // Pick a random user from matchQueue
          const randomIndex = Math.floor(Math.random() * matchQueue.length);
          const randomUserBId = matchQueue[randomIndex]._id; // Adjust according to your matchQueue schema

          // Simulate a like from this user to the current user
          const likeActionResult = await Like.create({
            likerId: randomUserBId,
            likedId: currentUserId,
          });

          let likeActionsResults: LikeActionResult[] = [];

          likeActionsResults.push({
            likerId: randomUserBId,
            likedId: currentUserId,
            success: !!likeActionResult,
          });

          // Remove the selected user from the matchQueue to avoid duplicates
          matchQueue.splice(randomIndex, 1);
        }

        return likeActionsResults;
      } catch (error) {
        console.error("Error simulating random likes:", error);
        throw new Error("Failed to simulate random likes.");
      }
    },
  },
};

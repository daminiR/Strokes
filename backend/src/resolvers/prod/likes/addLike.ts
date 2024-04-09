import User from '../../../models/User';
import Like from '../../../models/Likes';

export const resolvers = {
  Mutation: {
    recordLike: async (_, { likerId, likedId }) => {
      try {
        console.log(likedId, likedId)
        const existingLike = await Like.findOne({ likerId, likedId });
        if (existingLike) {
          return {
            success: false,
            message: "Like already recorded.",
            matchFound: false,
          };
        }

        await Like.create({ likerId, likedId });

        const mutualLike = await Like.findOne({
          likerId: likedId,
          likedId: likerId,
        });
        if (mutualLike) {
          // Optional: Implement logic for match found
          return { success: true, message: "Match found!", matchFound: true };
        }

        return {
          success: true,
          message: "Like recorded successfully.",
          matchFound: false,
        };
      } catch (error) {
        console.error("Error recording like:", error);
        return {
          success: false,
          message: "Error recording like.",
          matchFound: false,
        };
      }
    },
  },
  Query: {
    checkForMutualLike: async (_, { currentUserId, likedId }) => {
      try {
        // Check if there's a like from the current user to likedId
        const likeTo = await Like.findOne({
          likerId: currentUserId,
          likedId: likedId,
        });

        // Check if there's a like from likedId to the current user
        const likeFrom = await Like.findOne({
          likerId: likedId,
          likedId: currentUserId,
        });

        // A mutual like exists if both likeTo and likeFrom are not null
        const isMutual = !!likeTo && !!likeFrom;

        return { isMutual };
      } catch (error) {
        console.error("Error checking for mutual like:", error);
        throw new Error("Failed to check for mutual like.");
      }
    },
  },
};

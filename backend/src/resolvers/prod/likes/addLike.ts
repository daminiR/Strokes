import User from '../../../models/User';
import Like from '../../../models/Likes';

export const resolvers = {
  Mutation: {
    recordLike: async (_, { likerId, likedId }) => {
      try {
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
  Query: {},
};

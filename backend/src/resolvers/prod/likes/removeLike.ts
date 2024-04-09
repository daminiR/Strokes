import User from '../../../models/User';
import Like from '../../../models/Likes';

export const resolvers = {
  Mutation: {
    removeLike: async (_, { likerId, likedId }) => {
      try {
        const like = await Like.findOneAndDelete({ likerId, likedId });
        if (!like) {
          return {
            success: false,
            message: "Like not found.",
            matchFound: false,
          };
        }

        // Optional: Additional logic upon removing a like
        return {
          success: true,
          message: "Like removed successfully.",
          matchFound: false,
        };
      } catch (error) {
        console.error("Error removing like:", error);
        return {
          success: false,
          message: "Error removing like.",
          matchFound: false,
        };
      }
    },
  },
  Query: {},
};

import User from '../../../models/User';
import Like from '../../../models/Likes';
import Match from "../../../models/Match";
import { PotentialMatchPool } from "../../../models/PotentialMatchPool";

interface QueryArgs {
  userId: string;
  page: number;
  limit: number;
}

export const resolvers = {
  Query: {
    fetchLikedIds: async (
      _: any,
      { userId, page, limit }: { userId: string; page: number; limit: number }
    ) => {
      try {
        const currentUser = await User.findById(userId);
        if (!currentUser) {
          throw new Error("User not found");
        }

        const matchPool = await PotentialMatchPool.findOne({ userId: userId });
        if (!matchPool) {
          throw new Error("Match pool not found for the user.");
        }

        const allLikes = await Like.find({ likedId: userId });
        const matches = await Match.find({
          $or: [{ user1Id: userId }, { user2Id: userId }],
        });
        const matchedUserIds = matches.map((match) =>
          match.user1Id.toString() === userId
            ? match.user2Id.toString()
            : match.user1Id.toString()
        );
        const dislikedIds = matchPool.dislikes.map((dislike) =>
          dislike._id.toString()
        );

        const validLikes = allLikes.filter(
          (like) =>
            !matchedUserIds.includes(like.likerId.toString()) &&
            !dislikedIds.includes(like.likerId.toString())
        );

        if (validLikes.length === 0) {
          return []; // Return early if no valid likes to avoid unnecessary processing
        }

        validLikes.sort(
          (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
        );

        const pagedLikes = validLikes.slice((page - 1) * limit, page * limit);

        const validLikedUserIds = pagedLikes.map((like) =>
          like.likerId.toString()
        );
        const users = await User.find({
          _id: { $in: validLikedUserIds },
        }).select(
          "firstName imageSet age neighborhood gender sport description"
        );

        const currentDate = new Date().toISOString();
        return users.map((user, index) => ({
          matchUserId: user._id.toString(),
          firstName: user.firstName,
          imageSet: user.imageSet,
          age: user.age,
          neighborhood: user.neighborhood,
          gender: user.gender,
          sport: user.sport,
          description: user.description,
          createdAt: currentDate,
          updatedAt: currentDate,
          interacted: false,
          isBlurred: (page - 1) * limit + index >= matchPool.likesPerDay,
        }));
      } catch (error) {
        console.error("Error fetching potential matches:", error);
        // Safeguard with instanceof to properly check error type
        if (error instanceof Error) {
          throw new Error(
            `Failed to fetch potential matches due to: ${error.message}`
          );
        } else {
          throw new Error(
            "An unexpected error occurred while fetching potential matches."
          );
        }
      }
    },
  },
};

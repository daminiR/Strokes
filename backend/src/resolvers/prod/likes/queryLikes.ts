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
    fetchLikedIds: async (_, { userId, page, limit }) => {
      try {
        const PAGE_SIZE = limit;
        const skip = (page - 1) * PAGE_SIZE;

        // Fetch match pool data for the user
        const matchPool = await PotentialMatchPool.findOne({ userId: userId });
        if (!matchPool) {
          throw new Error("Match pool not found for the user.");
        }

        // Fetch likes sorted by timestamps in descending order
        const likes = await Like.find({ likedId: userId })
          .sort({ timestamps: -1 }) // Sorting by timestamps
          .skip(skip)
          .limit(PAGE_SIZE);

        // Filter out disliked and matched user IDs
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

        const validLikedUserIds = likes
          .map((like) => like.likerId.toString())
          .filter(
            (id) => !matchedUserIds.includes(id) && !dislikedIds.includes(id)
          );

        if (validLikedUserIds.length === 0) {
          return []; // No valid likes after exclusions
        }
        console.log("len of validLies", likes.length)

        // Fetch detailed user data, excluding disliked users
        const users = await User.find({
          _id: { $in: validLikedUserIds },
        }).select(
          "firstName image_set age neighborhood gender sport description"
        );

        const currentDate = new Date().toISOString();

        // Map over fetched users to determine which should be blurred based on LikesPerDay
        return users.map((user, index) => ({
          matchUserId: user._id.toString(),
          firstName: index < matchPool.likesPerDay ? user.firstName : null,
          imageSet:
            index < matchPool.likesPerDay
              ? user.image_set
              : "path/to/dummy/image.jpg",
          age: index < matchPool.likesPerDay ? user.age : null,
          neighborhood:
            index < matchPool.likesPerDay ? user.neighborhood : null,
          gender: index < matchPool.likesPerDay ? user.gender : null,
          sport: index < matchPool.likesPerDay ? user.sport : null,
          description:
            index < matchPool.likesPerDay
              ? user.description
              : "This profile is blurred. Like more to reveal!",
          createdAt: currentDate,
          updatedAt: currentDate,
          interacted: false,
          isBlurred: index >= matchPool.likesPerDay,
        }));
      } catch (error) {
        if (error instanceof Error) {
          console.error("Error fetching potential matches:", error.message);
          throw new Error(
            `Failed to fetch potential matches due to: ${error.message}`
          );
        } else {
          console.error("An unexpected error occurred", error);
          throw new Error(
            "An unexpected error occurred while fetching potential matches."
          );
        }
      }
    },
  },
};

import Match from '../../../models/Match';
import User from '../../../models/User';

export const resolvers = {
  Query: {
    async fetchMatchesForUser(_, { userId, page, limit }) {
      try {
        // Calculate the number of documents to skip
        const skip = (page - 1) * limit;

        // Fetch matches where the provided userId is either user1Id or user2Id with pagination
        const matches = await Match.find({
          $or: [{ user1Id: userId }, { user2Id: userId }],
        })
          .skip(skip)
          .limit(limit);

        // Extract matched user IDs from the matches
        const matchedUserIds = matches.map((match) =>
          match.user1Id === userId ? match.user2Id : match.user1Id
        );

        // If no matches are found, return an empty array early
        if (matchedUserIds.length === 0) {
          return [];
        }

        // Fetch user details for each matched user ID
        const matchedUsers = await User.find({
          _id: { $in: matchedUserIds },
        });

        // Extract and return the desired fields from user profiles
        const userProfiles = matchedUsers.map((user) => ({
          _id: user._id,
          firstName: user.firstName,
          imageSet: user.imageSet,
          age: user.age,
          neighborhood: user.neighborhood,
          gender: user.gender,
          sport: user.sport,
          description: user.description,
        }));

        return userProfiles;
      } catch (error) {
        console.error(error);
        throw new Error("Failed to fetch matches.");
      }
    },
  },
  Mutation: {
    async createMatch(_, { user1Id, user2Id }) {
      try {
        const newMatch = await Match.create({ user1Id, user2Id });
        return {
          success: true,
          message: "Match created successfully.",
          match: newMatch,
        };
      } catch (error) {
        console.error(error);
        return {
          success: false,
          message: "Failed to create match.",
          match: null,
        };
      }
    },
    async removeMatch(_, { matchId }) {
      try {
        const deletedMatch = await Match.findByIdAndDelete(matchId);
        if (!deletedMatch) {
          return {
            success: false,
            message: "Match not found.",
            match: null,
          };
        }
        return {
          success: true,
          message: "Match removed successfully.",
          match: deletedMatch,
        };
      } catch (error) {
        console.error(error);
        return {
          success: false,
          message: "Failed to remove match.",
          match: null,
        };
      }
    },
  },
};

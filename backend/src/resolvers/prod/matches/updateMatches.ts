import Match from '../../../models/Match';

export const resolvers = {
  Query: {
    async fetchMatchesForUser(_, { userId }) {
      try {
        // Fetch matches where the provided userId is either user1Id or user2Id
        const matches = await Match.find({
          $or: [{ user1Id: userId }, { user2Id: userId }]
        });
        return matches;
      } catch (error) {
        console.error(error);
        throw new Error("Failed to fetch matches.");
      }
    },
    async fetchMatchById(_, { matchId }) {
      try {
        const match = await Match.findById(matchId);
        return match;
      } catch (error) {
        console.error(error);
        throw new Error("Failed to fetch match.");
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

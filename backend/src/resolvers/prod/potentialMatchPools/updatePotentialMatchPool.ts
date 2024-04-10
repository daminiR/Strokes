import { PotentialMatchPool} from '../../../models/PotentialMatchPool';

export const resolvers = {
  Query: {
    // Fetch the potential match pool for a specific user
    getPotentialMatchPool: async (_, { userId }) => {
      try {
        const matchPool = await PotentialMatchPool.findOne({ userId }).populate('potentialMatches.matchUserId');
        return matchPool;
      } catch (error) {
        console.error("Error fetching potential match pool:", error);
        throw new Error("Failed to fetch potential match pool.");
      }
    },
  },
  Mutation: {
    // Updates the potential match pool for a user with new matches
    updatePotentialMatchPool: async (_, { userId, matches }) => {
      try {
        const updatedMatches = matches.map(matchUserId => ({
          matchUserId,
          createdAt: new Date(),
          updatedAt: new Date(),
          interacted: false,
        }));

        const updatedMatchPool = await PotentialMatchPool.findOneAndUpdate(
          { userId },
          { $set: { potentialMatches: updatedMatches }},
          { new: true, upsert: true }
        );

        return {
          success: true,
          message: "Potential match pool updated successfully.",
          potentialMatchPool: updatedMatchPool,
        };
      } catch (error) {
        console.error("Error updating potential match pool:", error);
        return { success: false, message: "Failed to update potential match pool." };
      }
    },

    // Record an interaction with a potential match (like/dislike)
    interactWithPotentialMatch: async (_, { userId, matchUserId, interacted }) => {
    try {
      // Fetch the document for the current user's match pool
      const matchPoolDoc = await PotentialMatchPool.findOne({ userId });

      if (!matchPoolDoc) {
        throw new Error("Match pool not found.");
      }

      // Locate the specific potential match within the match pool
      const matchIndex = matchPoolDoc.potentialMatches.findIndex(
        (match) => match.matchUserId === matchUserId
      );

      if (matchIndex === -1) {
        throw new Error("Match not found in potential match pool.");
      }

      // Update the 'interacted' status and 'updatedAt' timestamp for this match
      matchPoolDoc.potentialMatches[matchIndex].interacted = interacted;
      matchPoolDoc.potentialMatches[matchIndex].updatedAt = new Date();

      // Save the updated match pool document
      await matchPoolDoc.save();

      return {
        success: true,
        message: "Interaction with potential match updated successfully.",
        potentialMatch: matchPoolDoc.potentialMatches[matchIndex],
      };
    } catch (error) {
      if (error instanceof Error) {
        console.error(
          "Error updating interaction with potential match:",
          error.message
        );
        return {
          success: false,
          message:
            "Failed to update interaction with potential match: " +
            error.message,
        };
      } else {
        console.error("An unexpected error occurred", error);
        return {
          success: false,
          message:
            "Failed to update interaction with potential match due to an unexpected error.",
        };
      }
    }
  },
}
}

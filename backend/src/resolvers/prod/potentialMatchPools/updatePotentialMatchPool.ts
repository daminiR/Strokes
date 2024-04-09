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
        // This example assumes you update a single match's interacted status.
        // Adjust the logic based on your specific requirements, e.g., if multiple matches can be interacted with at once.
        const matchPool = await PotentialMatchPool.findOne({ userId });

        if (!matchPool) {
          throw new Error("Match pool not found.");
        }

        const matchIndex = matchPool.potentialMatches.findIndex(match => match.matchUserId.toString() === matchUserId);
        if (matchIndex === -1) {
          throw new Error("Match not found in potential match pool.");
        }

        // Update the interacted flag for the specified match
        matchPool.potentialMatches[matchIndex].interacted = interacted;
        matchPool.potentialMatches[matchIndex].updatedAt = new Date();

        await matchPool.save();

        return {
          success: true,
          message: "Interaction recorded successfully.",
          potentialMatch: matchPool.potentialMatches[matchIndex],
        };
      } catch (error) {
        console.error("Error recording interaction with potential match:", error);
        return { success: false, message: "Failed to record interaction with potential match." };
      }
    },
  },
};

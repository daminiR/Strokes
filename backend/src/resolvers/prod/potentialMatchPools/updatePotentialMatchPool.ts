import { PotentialMatchPool} from '../../../models/PotentialMatchPool';
import User from '../../../models/User';

export const resolvers = {
  Query: {
    fetchMatchQueueForNewUser: async (userId, filters, filtersHash) => {
      // Assuming 'User' and 'PotentialMatchPool' are Mongoose models
      // Let's also assume that 'filters' structure and 'filtersHash' calculation are handled outside this function

      const currentDate = new Date();

      // Define the match criteria based on provided filters
      const matchCriteria = {
        _id: { $ne: userId }, // Exclude the new user
        age: { $gte: filters.age.min, $lte: filters.age.max },
        "sport.gameLevel": {
          $gte: filters.gameLevel.min,
          $lte: filters.gameLevel.max,
        },
      };

      // Fetch potential matches based on criteria from the 'User' collection
      const potentialMatchesQuery = await User.aggregate([
        { $match: matchCriteria },
        { $sample: { size: 30 } }, // Randomly select 30 users to potentially match with
        {
          $project: {
            firstName: 1,
            imageSet: 1,
            age: 1,
            neighborhood: 1,
            gender: 1,
            sport: 1,
            description: 1,
          },
        },
      ]);

      // Prepare the potential matches array for the PotentialMatchPool document
      const potentialMatchPoolData = potentialMatchesQuery.map((match) => ({
        matchUserId: match._id.toString(), // Convert ObjectId to string
        firstName: match.firstName,
        imageSet: match.imageSet,
        age: match.age,
        neighborhood: match.neighborhood,
        gender: match.gender,
        sport: match.sport,
        description: match.description,
        createdAt: currentDate,
        updatedAt: currentDate,
        interacted: false,
      }));

      // Create or update the PotentialMatchPool document for the new user
      await PotentialMatchPool.findOneAndUpdate(
        { userId: userId },
        {
          $set: {
            userId: userId,
            filters: filters,
            filtersHash: filtersHash,
            potentialMatches: potentialMatchPoolData,
          },
        },
        { upsert: true, new: true } // Ensure document is created if it doesn't exist
      );

      console.log(
        "PotentialMatchPool document created/updated for the new user."
      );

      // Return the potential matches to the caller
      return potentialMatchPoolData;
    },

    getPotentialMatchPool: async (_, { userId }) => {
      try {
        const matchPool = await PotentialMatchPool.findOne({ userId }).populate(
          "potentialMatches.matchUserId"
        );
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
        const updatedMatches = matches.map((matchUserId) => ({
          matchUserId,
          createdAt: new Date(),
          updatedAt: new Date(),
          interacted: false,
        }));

        const updatedMatchPool = await PotentialMatchPool.findOneAndUpdate(
          { userId },
          { $set: { potentialMatches: updatedMatches } },
          { new: true, upsert: true }
        );

        return {
          success: true,
          message: "Potential match pool updated successfully.",
          potentialMatchPool: updatedMatchPool,
        };
      } catch (error) {
        console.error("Error updating potential match pool:", error);
        return {
          success: false,
          message: "Failed to update potential match pool.",
        };
      }
    },

    // Record an interaction with a potential match (like/dislike)
    interactWithPotentialMatch: async (
      _,
      { userId, matchUserId, interacted }
    ) => {
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
  },
};

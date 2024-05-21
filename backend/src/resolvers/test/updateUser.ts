import User from '../../models/User';
import Like from '../../models/Likes';
import Match from '../../models/Match';
import { PotentialMatchPool } from "../../models/PotentialMatchPool";
import _ from 'lodash'
import { SHA256 } from 'crypto-js';
import { apiToken, userAPI, groupChannelApi} from './../../services/sendbirdService';
import { Sendbird } from 'sendbird-platform-sdk';

interface LikeActionResult {
  likerId: string;
  likedId: string;
  success: boolean;
}

export const resolvers = {
  Mutation: {
    updatePlayerPreferencesTest: async () => {
      // Fetch all users. Consider using cursor or pagination if the dataset is large.
      const usersCursor = User.find().cursor();

      for (
        let userDoc = await usersCursor.next();
        userDoc != null;
        userDoc = await usersCursor.next()
      ) {
        const { _id } = userDoc;

        // Fetch the corresponding PotentialMatchPool document for the user
        const potentialMatchPoolDoc = await PotentialMatchPool.findOne({
          userId: _id,
        });

        if (!potentialMatchPoolDoc) {
          console.log(
            `No PotentialMatchPool found for user with ID ${_id}. Skipping.`
          );
          continue; // Skip to the next user if no corresponding PotentialMatchPool document is found
        }

        const { filters } = potentialMatchPoolDoc;

        // No need to reconstruct filters here, use them directly from the PotentialMatchPool document
        const filtersString = JSON.stringify(filters);
        const filtersHash = SHA256(filtersString).toString();

        // Update the PotentialMatchPool document with the new hash
        await PotentialMatchPool.updateOne(
          { userId: _id },
          {
            $set: {
              filtersHash: filtersHash, // Update the hash in the PotentialMatchPool document
            },
          }
        );
      }

      return {
        success: true,
        message:
          "Completed updating filtersHash in PotentialMatchPool for all users.",
      };
    },
    removeAllMatchesForUserTest: async (_: any, { userId }) => {
      try {
        // Remove all matches where the user is either user1Id or user2Id
        const removedMatches = await Match.deleteMany({
          $or: [{ user1Id: userId }, { user2Id: userId }],
        });

        // Remove corresponding Sendbird group channels
        const data = await groupChannelApi.gcListChannels(
          apiToken,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          userId
        );
        //console.log("API called successfully. Returned data: " + data);

        if (data.channels) {
          for (const channel of data.channels) {
            try {
              const deleteBody: Sendbird.GroupChannelApiGcDeleteChannelByUrlRequest =
                {
                  apiToken: apiToken,
                  channelUrl: channel.channelUrl,
                };
              if (channel.channelUrl) {
                await groupChannelApi.gcDeleteChannelByUrl(
                  apiToken,
                  channel.channelUrl
                );
              }
            } catch (deleteError) {
              console.error(
                `Error deleting Sendbird group channel ${channel}:`,
                deleteError
              );
            }
          }
        }
        // Construct a result summary
        const result = {
          removedMatchesCount: removedMatches.deletedCount,
          success: true,
          message: `Removed ${removedMatches.deletedCount} matches.`,
        };
        return result;
      } catch (error) {
        console.error("Error removing matches for user:", error);
        return {
          success: false,
          message: "Failed to remove matches.",
          removedMatchesCount: 0,
        };
      }
    },
    removeAllLikesForUserTest: async (_, { userId }) => {
      try {
        // Ensure the user exists
        const userExists = await User.exists({ _id: userId });
        if (!userExists) {
          throw new Error("User not found");
        }

        // Remove all likes where the user is the liker
        const removedAsLiker = await Like.deleteMany({ likerId: userId });

        // Remove all likes where the user is the liked
        const removedAsLiked = await Like.deleteMany({ likedId: userId });

        // Construct a result summary
        const result = {
          removedAsLikerCount: removedAsLiker.deletedCount,
          removedAsLikedCount: removedAsLiked.deletedCount,
          success: true,
          message: `Removed ${
            removedAsLiker.deletedCount + removedAsLiked.deletedCount
          } likes.`,
        };

        return result;
      } catch (error) {
        console.error("Error removing likes for user:", error);
        return {
          success: false,
          message: "Failed to remove likes.",
          removedAsLikerCount: 0,
          removedAsLikedCount: 0,
        };
      }
    },
    removeAllLikesByUser: async (_, { userId }) => {
      try {
        // Check if the user exists
        const userExists = await User.findById(userId);
        if (!userExists) {
          throw new Error("User not found");
        }

        // Remove all likes where the user is the liker
        const deletionResult = await Like.deleteMany({ likerId: userId });

        // Check if likes were actually deleted
        if (deletionResult.deletedCount === 0) {
          return {
            success: false,
            message: "No likes found or removed for this user.",
          };
        }

        return {
          success: true,
          message: `All likes by user ${userId} have been successfully removed.`,
        };
      } catch (error) {
        console.error("Error removing likes:", error);
        if (error instanceof Error) {
          return {
            success: false,
            message: `Failed to remove likes: ${error.message}`,
          };
        } else {
          return {
            success: false,
            message: "Failed to remove likes due to an unknown error.",
          };
        }
      }
    },
    removeAllDislikesTest: async (_, { userId }) => {
      try {
        // Validate that the user ID is provided
        if (!userId) {
          throw new Error("User ID must be provided");
        }

        // Fetch the user's potential match pool to ensure it exists
        const potentialMatchPool = await PotentialMatchPool.findOne({
          userId: userId,
        });
        if (!potentialMatchPool) {
          throw new Error(
            "Potential match pool not found for the specified user"
          );
        }

        // Update the PotentialMatchPool document by setting dislikes to an empty array
        const updateResult = await PotentialMatchPool.updateOne(
          { userId: userId },
          {
            $set: {
              dislikes: [],
            },
          }
        );

        // Check if the document was successfully updated
        if (updateResult.modifiedCount === 0) {
          return {
            success: false,
            message:
              "No updates performed. The user may already have no dislikes.",
          };
        }
        return {
          success: true,
          message: "All dislikes have been successfully removed for the user.",
        };
      } catch (error) {
        // Enhanced error handling with instance check
        if (error instanceof Error) {
          console.error("Error removing dislikes:", error.message);
          return {
            success: false,
            message: `Failed to remove dislikes: ${error.message}`,
          };
        } else {
          console.error("Error removing dislikes: An unknown error occurred.");
          return {
            success: false,
            message: "Failed to remove dislikes due to an unknown error.",
          };
        }
      }
    },
    updatePotentialMatchesTest: async (_, { currentUserId }) => {
      try {
        // Fetch the current user
        const currentUser = await User.findById(currentUserId);
        if (!currentUser) {
          throw new Error("User not found");
        }

        // Fetch the user's potential match pool
        const potentialMatchPool = await PotentialMatchPool.findOne({
          userId: currentUserId,
        });
        if (!potentialMatchPool) {
          throw new Error(
            "Potential match pool not found for the current user"
          );
        }

        // Fetch user IDs that the current user has already liked
        const likes = await Like.find({ likerId: currentUserId });
        const likedUserIds = likes.map((like) => like.likedId);

        // Extract user IDs that the current user has disliked
        const dislikedUserIds = potentialMatchPool.dislikes.map(
          (dislike) => dislike._id
        );

        // Retrieve filters from the PotentialMatchPool, fall back to default if necessary
        const { age = { min: 18, max: 100 }, gameLevel = { min: 1, max: 10 } } =
          potentialMatchPool.filters || {};

        // Define match criteria excluding already liked and disliked users
        const matchCriteria = {
          _id: {
            $nin: [...likedUserIds, ...dislikedUserIds],
            $ne: currentUserId,
          },
          age: { $gte: age.min, $lte: age.max },
          "sport.gameLevel": { $gte: gameLevel.min, $lte: gameLevel.max },
        };

        // Fetch 30 random potential matches that meet the criteria
        const newPotentialMatches = await User.aggregate([
          { $match: matchCriteria },
          { $sample: { size: 30 } },
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
        // Create Sendbird users for the new potential matches
        for (const match of newPotentialMatches) {
          const sendbirdUserData: Sendbird.UserApiCreateUserRequest = {
            userId: match._id.toString(),
            nickname: match.firstName,
            profileUrl: match.imageSet[0]?.url || "",
          };

          try {
            await userAPI.createUser(apiToken, sendbirdUserData);
            console.log(`Sendbird user created for ${match.firstName}`);
          } catch (sendbirdError) {
            console.error(
              `Error creating Sendbird user for ${match.firstName}:`,
              sendbirdError
            );
          }
        }
        // Update the PotentialMatchPool document with new matches
        await PotentialMatchPool.updateOne(
          { userId: currentUserId },
          {
            $set: {
              potentialMatches: newPotentialMatches.map((match) => ({
                matchUserId: match._id,
                firstName: match.firstName,
                imageSet: match.imageSet,
                age: match.age,
                neighborhood: match.neighborhood,
                gender: match.gender,
                sport: match.sport,
                description: match.description,
                createdAt: new Date(),
                updatedAt: new Date(),
                interacted: false,
              })),
              lastUpdated: new Date(),
              swipesPerDay: 30,
            },
          },
          { upsert: true }
        );

        console.log(
          "Potential match pool updated with 30 new matches for the user."
        );
        return {
          success: true,
          message:
            "Potential match pool updated with 30 new matches for the user.",
        };
      } catch (error) {
        // Log the error with a generic message if it's not an instance of Error
        if (error instanceof Error) {
          console.error("Error updating potential matches:", error.message);
          return {
            success: false,
            message: error.message,
          };
        } else {
          console.error(
            "Error updating potential matches: An unknown error occurred."
          );
          return {
            success: false,
            message:
              "Failed to update potential matches due to an unknown error.",
          };
        }
      }
    },
    async simulateRandomLikesFromUsersTest(
      _: any,
      {
        currentUserId,
        randomize = true,
      }: { currentUserId: string; randomize: boolean }
    ): Promise<LikeActionResult[]> {
      try {
        const currentUser = await User.findById(currentUserId);
        if (!currentUser) {
          throw new Error("User not found");
        }

        const allUsers = await User.find({ _id: { $ne: currentUserId } });
        if (!allUsers.length) {
          throw new Error("No other users found in the database");
        }

        // Shuffle all users if randomization is requested
        if (randomize) {
          for (let i = allUsers.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [allUsers[i], allUsers[j]] = [allUsers[j], allUsers[i]];
          }
        }

        const numLikes = randomize
          ? Math.min(40, allUsers.length)
          : allUsers.length;
        const likeActionsResults: LikeActionResult[] = [];

        for (let i = 0; i < numLikes; i++) {
          const randomUser = allUsers[i]; // Use directly shuffled array

          const likeActionResult = await Like.create({
            likerId: randomUser._id,
            likedId: currentUserId,
          });
          // Create Sendbird user
          const sendbirdUserData: Sendbird.UserApiCreateUserRequest = {
            userId: randomUser._id.toString(),
            nickname: randomUser.firstName,
            profileUrl: randomUser.imageSet[0]?.imageURL || "",
          };

          try {
            await userAPI.createUser(apiToken, sendbirdUserData);
            console.log(`Sendbird user created for ${randomUser.firstName}`);
          } catch (sendbirdError) {
            console.error(
              `Error creating Sendbird user for ${randomUser.firstName}:`,
              sendbirdError
            );
          }

          likeActionsResults.push({
            likerId: randomUser._id.toString(),
            likedId: currentUserId,
            success: !!likeActionResult,
          });
        }

        return likeActionsResults;
      } catch (error) {
        console.error("Error simulating random likes from users:", error);
        throw new Error("Failed to simulate random likes from users.");
      }
    },
    simulateRandomLikesTest: async (_, { currentUserId, randomize = true }) => {
      try {
        const currentUser = await User.findById(currentUserId);
        if (!currentUser) {
          throw new Error("User not found");
        }

        const potentialMatchPool = await PotentialMatchPool.findOne({
          userId: currentUserId,
        });
        if (!potentialMatchPool) {
          throw new Error(
            "Potential match pool not found for the current user"
          );
        }

        const potentialMatches = potentialMatchPool.potentialMatches;
        if (!potentialMatches || potentialMatches.length === 0) {
          throw new Error("No potential matches found for the current user");
        }

        const likeActionsResults: LikeActionResult[] = [];
        const numLikes = randomize
          ? Math.min(10, potentialMatches.length)
          : potentialMatches.length;

        for (let i = 0; i < numLikes; i++) {
          const index = randomize
            ? Math.floor(Math.random() * potentialMatches.length)
            : i;
          const randomMatch = potentialMatches[index];

          // Simulate a like from this potential match to the current user
          const likeActionResult = await Like.create({
            likerId: randomMatch.matchUserId,
            likedId: currentUserId,
          });
          // Create Sendbird user
          const sendbirdUserData: Sendbird.UserApiCreateUserRequest = {
            userId: randomMatch.matchUserId.toString(),
            nickname: randomMatch.firstName,
            profileUrl: randomMatch.imageSet[0]?.imageURL || "",
          };

          try {
            await userAPI.createUser(apiToken, sendbirdUserData);
            console.log(`Sendbird user created for ${randomMatch.firstName}`);
          } catch (sendbirdError) {
            console.error(
              `Error creating Sendbird user for ${randomMatch.firstName}:`,
              sendbirdError
            );
          }

          likeActionsResults.push({
            likerId: randomMatch.matchUserId,
            likedId: currentUserId,
            success: !!likeActionResult,
          });
        }

        // Update the PotentialMatchPool document with the modified potentialMatches array if randomizing
        if (randomize) {
          await PotentialMatchPool.updateOne(
            { userId: currentUserId },
            { $set: { potentialMatches: potentialMatches } }
          );
        }

        return likeActionsResults;
      } catch (error) {
        console.error("Error simulating random likes:", error);
        throw new Error("Failed to simulate random likes.");
      }
    },
    manageUserInteractions: async (_, { currentUserId }) => {
      try {
        // Step 1: Remove all likes for the current user
        const likesRemovalResult =
          await resolvers.Mutation.removeAllLikesForUserTest(_, {
            userId: currentUserId,
          });
        if (!likesRemovalResult.success) {
          throw new Error(likesRemovalResult.message);
        }
        console.log(likesRemovalResult.message);

        // Step 2: Remove all matches for the current user
        const matchesRemovalResult =
          await resolvers.Mutation.removeAllMatchesForUserTest(_, {
            userId: currentUserId,
          });
        if (!matchesRemovalResult.success) {
          throw new Error(matchesRemovalResult.message);
        }
        console.log(matchesRemovalResult.message);

        // Step 3: Update the potential match pool for the current user
        const updateMatchesResult =
          await resolvers.Mutation.updatePotentialMatchesTest(_, {
            currentUserId: currentUserId,
          });
        if (!updateMatchesResult.success) {
          throw new Error(updateMatchesResult.message);
        }
        console.log(updateMatchesResult.message);

        // Step 4: Simulate random likes for the current user
        const randomLikesResult =
          await resolvers.Mutation.simulateRandomLikesTest(_, {
            currentUserId,
          });
        //if (!randomLikesResult.success) {
        //throw new Error(randomLikesResult.message);
        //}
        //console.log(randomLikesResult.message);

        return {
          success: true,
          message: "All interactions managed successfully.",
          likesRemovalResult,
          matchesRemovalResult,
          updateMatchesResult,
          randomLikesResult,
        };
      } catch (error) {
        console.error("Error managing user interactions:", error);
        const errorMessage =
          error instanceof Error ? error.message : "Unknown error occurred";

        // Ensuring that the error result structures are consistent with the expected output
        return {
          success: false,
          message: errorMessage,
          likesRemovalResult: { success: false, message: errorMessage },
          matchesRemovalResult: { success: false, message: errorMessage },
          updateMatchesResult: { success: false, message: errorMessage },
          randomLikesResult: {
            success: false,
            message: errorMessage,
            likes: [],
          }, // assuming likes is a required field in LikeActionResult
        };
      }
    },
  },
};

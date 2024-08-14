import User from '../../models/User';
import {createSendbirdUser} from '../../utils/sendBirdv2'
import Like from '../../models/Likes';
import Match from '../../models/Match';
import {PotentialMatchPool} from "../../models/PotentialMatchPool";
import _ from 'lodash'
import {SHA256} from 'crypto-js';
import {apiToken, userAPI, groupChannelApi} from './../../services/sendbirdService';
import {Sendbird} from 'sendbird-platform-sdk';

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
        const {_id} = userDoc;

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

        const {filters} = potentialMatchPoolDoc;

        // No need to reconstruct filters here, use them directly from the PotentialMatchPool document
        const filtersString = JSON.stringify(filters);
        const filtersHash = SHA256(filtersString).toString();

        // Update the PotentialMatchPool document with the new hash
        await PotentialMatchPool.updateOne(
          {userId: _id},
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
    removeAllMatchesForUserTest: async (_: any, {userId}) => {
      try {
        // Remove all matches where the user is either user1Id or user2Id
        const removedMatches = await Match.deleteMany({
          $or: [{user1Id: userId}, {user2Id: userId}],
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
    removeAllLikesForUserTest: async (_, {userId}) => {
      try {
        // Ensure the user exists
        const userExists = await User.exists({_id: userId});
        if (!userExists) {
          throw new Error("User not found");
        }

        // Remove all likes where the user is the liker
        const removedAsLiker = await Like.deleteMany({likerId: userId});

        // Remove all likes where the user is the liked
        const removedAsLiked = await Like.deleteMany({likedId: userId});

        // Construct a result summary
        const result = {
          removedAsLikerCount: removedAsLiker.deletedCount,
          removedAsLikedCount: removedAsLiked.deletedCount,
          success: true,
          message: `Removed ${removedAsLiker.deletedCount + removedAsLiked.deletedCount
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
    removeAllLikesByUser: async (_, {userId}) => {
      try {
        // Check if the user exists
        const userExists = await User.findById(userId);
        if (!userExists) {
          throw new Error("User not found");
        }

        // Remove all likes where the user is the liker
        const deletionResult = await Like.deleteMany({likerId: userId});

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
    removeAllDislikesTest: async (_, {userId}) => {
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
          {userId: userId},
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
    updatePotentialMatchesTest: async (_, {currentUserId}) => {
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
        const likes = await Like.find({likerId: currentUserId});
        const likedUserIds = likes.map((like) => like.likedId);

        // Extract user IDs that the current user has disliked
        const dislikedUserIds = potentialMatchPool.dislikes.map(
          (dislike) => dislike._id
        );

        // Retrieve filters from the PotentialMatchPool, fall back to default if necessary
        const {age = {min: 18, max: 100}, gameLevel = {min: 1, max: 10}} =
          potentialMatchPool.filters || {};

        // Define match criteria excluding already liked and disliked users
        const matchCriteria = {
          _id: {
            $nin: [...likedUserIds, ...dislikedUserIds],
            $ne: currentUserId,
          },
          age: {$gte: age.min, $lte: age.max},
          "sport.gameLevel": {$gte: gameLevel.min, $lte: gameLevel.max},
        };

        // Fetch 30 random potential matches that meet the criteria
        const newPotentialMatches = await User.aggregate([
          {$match: matchCriteria},
          {$sample: {size: 30}},
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
          try {
            const sendbirdAccessToken = await createSendbirdUser(
              match._id.toString(),
              match.firstName,
              match.imageSet[0]?.url || ""
            );
            console.log(`Sendbird user created for ${match.firstName}`);
          } catch (sendbirdError: any) {
            console.error(
              `Error creating Sendbird user for ${match.firstName}:`,
              sendbirdError.message
            );
          }
        } // Update the PotentialMatchPool document with new matches
        await PotentialMatchPool.updateOne(
          {userId: currentUserId},
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
              //lastUpdated: new Date(),
              swipesPerDay: 30,
            },
          },
          {upsert: true}
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
    async addSpecificLike(
      _: any,
      {currentUserId, likerId}: {currentUserId: string; likerId: string}
    ): Promise<LikeActionResult> {
      try {
        // Fetch the current user
        const currentUser = await User.findById(currentUserId);
        if (!currentUser) {
          throw new Error("Current user not found");
        }

        // Fetch the liker user
        const likerUser = await User.findById(likerId);
        if (!likerUser) {
          throw new Error("Liker user not found");
        }

        // Create the like action
        const likeActionResult = await Like.create({
          likerId: likerUser._id,
          likedId: currentUserId,
        });

        // Return the result
        return {
          likerId: likerUser._id.toString(),
          likedId: currentUserId,
          success: !!likeActionResult,
        };
      } catch (error) {
        if (error instanceof Error) {
          console.error("Error adding specific like:", error.message);
          throw new Error("Failed to add specific like: " + error.message);
        } else {
          console.error("Error adding specific like: An unknown error occurred.");
          throw new Error("Failed to add specific like due to an unknown error.");
        }
      }
    },

    async simulateRandomLikesFromUsersTest(
      _: any,
      {
        currentUserId,
        randomize = true,
      }: {currentUserId: string; randomize: boolean}
    ): Promise<LikeActionResult[]> {
      try {
        const currentUser = await User.findById(currentUserId);
        if (!currentUser) {
          throw new Error("User not found");
        }

        const allUsers = await User.find({_id: {$ne: currentUserId}});
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
          let sendbirdAccessToken;
          try {
            sendbirdAccessToken = await createSendbirdUser(
              randomUser._id.toString(),
              randomUser.firstName,
              randomUser.imageSet[0]?.imageURL || ""
            );
            console.log(`Sendbird user created for ${randomUser.firstName}`);
          } catch (sendbirdError: any) {
            console.error(
              `Error creating Sendbird user for ${randomUser.firstName}:`,
              sendbirdError.message
            );
            throw new Error(
              "Failed to create Sendbird user: " + sendbirdError.message
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
        if (error instanceof Error) {
          console.error(
            "Error simulating random likes from users:",
            error.message
          );
          throw new Error(
            "Failed to simulate random likes from users: " + error.message
          );
        } else {
          console.error(
            "Error simulating random likes from users: An unknown error occurred."
          );
          throw new Error(
            "Failed to simulate random likes from users due to an unknown error."
          );
        }
      }
    },
    simulateRandomLikesTest: async (_, {currentUserId, randomize = true}) => {
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

        // Get potential matches
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

          try {
            // Simulate a like from this potential match to the current user
            const likeActionResult = await Like.create({
              likerId: randomMatch.matchUserId,
              likedId: currentUserId,
            });

            // Create Sendbird user
            let sendbirdAccessToken;
            try {
              sendbirdAccessToken = await createSendbirdUser(
                randomMatch.matchUserId,
                randomMatch.firstName,
                randomMatch.imageSet[0]?.imageURL
              );
              console.log(`Sendbird user created for ${randomMatch.firstName}`);
            } catch (sendbirdError: any) {
              console.error(
                `Error creating Sendbird user for ${randomMatch.firstName}:`,
                sendbirdError.message
              );
              throw new Error(
                "Failed to create Sendbird user: " + sendbirdError.message
              );
            }

            likeActionsResults.push({
              likerId: randomMatch.matchUserId,
              likedId: currentUserId,
              success: !!likeActionResult,
            });
          } catch (likeError: any) {
            console.error(
              `Error simulating like for user ${randomMatch.matchUserId}:`,
              likeError.message
            );
            likeActionsResults.push({
              likerId: randomMatch.matchUserId,
              likedId: currentUserId,
              success: false,
            });
          }
        }

        // Update the PotentialMatchPool document with the modified potentialMatches array if randomizing
        if (randomize) {
          await PotentialMatchPool.updateOne(
            {userId: currentUserId},
            {$set: {potentialMatches: potentialMatches}}
          );
        }

        return likeActionsResults;
      } catch (error) {
        if (error instanceof Error) {
          console.error("Error simulating random likes:", error.message);
          throw new Error("Failed to simulate random likes: " + error.message);
        } else {
          console.error(
            "Error simulating random likes: An unknown error occurred."
          );
          throw new Error(
            "Failed to simulate random likes due to an unknown error."
          );
        }
      }
    },
    manageUserInteractions: async (_, {currentUserId}) => {
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
          likesRemovalResult: {success: false, message: errorMessage},
          matchesRemovalResult: {success: false, message: errorMessage},
          updateMatchesResult: {success: false, message: errorMessage},
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

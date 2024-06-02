import Match from '../../../models/Match';
import { apiToken, userAPI, groupChannelApi} from './../../../services/sendbirdService';


// Create the userExists function using Sendbird SDK
async function userExists(userId: string, apiToken: string): Promise<boolean> {
  try {
    // Use the Sendbird SDK to get the user by ID
    const user = await userAPI.viewUserById(apiToken, userId);
    return !!user; // Return true if user exists
  } catch (error) {
    // If the error is a 404, the user does not exist
    //if (error.response && error.response.status === 404) {
      //return false;
    //}

    console.error(`Failed to check user existence: ${error}`);
    return false;
  }
}

export const resolvers = {
  Query: {
    async fetchMatchesForUser(
      _: any,
      { userId, page, limit }: { userId: string; page: number; limit: number }
    ) {
      try {
        // Calculate the number of documents to skip
        const skip = (page - 1) * limit;

        // Fetch matches where the provided userId is either user1Id or user2Id with pagination
        const matches = await Match.aggregate([
          {
            $match: {
              $or: [{ user1Id: userId }, { user2Id: userId }],
            },
          },
          {
            $lookup: {
              from: "users",
              let: {
                matchedUserId: {
                  $cond: [
                    { $eq: ["$user1Id", userId] },
                    "$user2Id",
                    "$user1Id",
                  ],
                },
              },
              pipeline: [
                { $match: { $expr: { $eq: ["$_id", "$$matchedUserId"] } } },
                {
                  $project: {
                    _id: 1,
                    firstName: 1,
                    imageSet: 1,
                    age: 1,
                    neighborhood: 1,
                    gender: 1,
                    sport: 1,
                    description: 1,
                  },
                },
              ],
              as: "matchedUser",
            },
          },
          {
            $unwind: "$matchedUser",
          },
          {
            $project: {
              _id: 1,
              user1Id: 1,
              user2Id: 1,
              channelUrl: 1,
              channelType: 1,
              channelStatus: 1,
              user1LastMessagePreview: 1,
              user1LastMessageTimestamp: 1,
              user1UnreadMessageCount: 1,
              user2LastMessagePreview: 1,
              user2LastMessageTimestamp: 1,
              user2UnreadMessageCount: 1,
              channelCreationDate: 1,
              channelExpiryDate: 1,
              readReceiptsStatus: 1,
              reportedBy: 1,
              blockedBy: 1,
              createdAt: 1,
              updatedAt: 1,
              matchedUser: 1,
            },
          },
          { $skip: skip },
          { $limit: limit },
        ]);

        // Transform the results to match the required format
        const userProfiles = matches.map((match) => ({
          _id: match.matchedUser._id,
          firstName: match.matchedUser.firstName,
          imageSet: match.matchedUser.imageSet,
          age: match.matchedUser.age,
          neighborhood: match.matchedUser.neighborhood,
          gender: match.matchedUser.gender,
          sport: match.matchedUser.sport,
          description: match.matchedUser.description,
          chat: {
            channelUrl: match.channelUrl,
            channelType: match.channelType,
            channelStatus: match.channelStatus,
            lastMessagePreview:
              match.user1Id === userId
                ? match.user1LastMessagePreview
                : match.user2LastMessagePreview,
            lastMessageTimestamp:
              match.user1Id === userId
                ? match.user1LastMessageTimestamp
                : match.user2LastMessageTimestamp,
            unreadMessageCount:
              match.user1Id === userId
                ? match.user1UnreadMessageCount
                : match.user2UnreadMessageCount,
            channelCreationDate: match.channelCreationDate,
            channelExpiryDate: match.channelExpiryDate,
            readReceiptsStatus: match.readReceiptsStatus,
            reportedBy: match.reportedBy,
            blockedBy: match.blockedBy,
          },
        }));

        return userProfiles;
      } catch (error) {
        if (error instanceof Error) {
          console.error(error);
          throw new Error("Failed to fetch matches.");
        } else {
          throw new Error("An unknown error occurred.");
        }
      }
    },
  },
  Mutation: {
    async createMatch(_, { user1Id, user2Id }) {
      try {
        const user1Exists = await userExists(user1Id, apiToken);
        const user2Exists = await userExists(user2Id, apiToken);

        if (!user1Exists || !user2Exists) {
          console.error(
            "One or both users do not exist. Channel creation aborted."
          );
          return;
        }
        // Create a group channel with the two users
        const createChannelData = {
          name: `${user1Id}__${user2Id} Chat`,
          userIds: [user1Id, user2Id],
          is_distinct: true,
        };

        const response = await groupChannelApi.gcCreateChannel(
          apiToken,
          createChannelData
        );

        const channelUrl = response.channelUrl;
        // Now create a match document with the new channel URL
        const newMatch = await Match.create({
          user1Id,
          user2Id,
          channelUrl: channelUrl,
          channelType: "private",
          channelStatus: "active",
          user1LastMessagePreview: "",
          user1LastMessageTimestamp: new Date(),
          user1UnreadMessageCount: 0,
          user2LastMessagePreview: "",
          user2LastMessageTimestamp: new Date(),
          user2UnreadMessageCount: 0,
          channelCreationDate: new Date(),
          channelExpiryDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
          readReceiptsStatus: false,
          reportedBy: null,
          blockedBy: null,
        });

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

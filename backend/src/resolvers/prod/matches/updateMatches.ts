import Match from "../../../models/Match";
import {
  createChannel,
  userExists,
  hideSendbirdChannel,
} from "./../../../utils/sendBirdv2";


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
        console.log(userId)
        const matches = await Match.aggregate([
          {
            $match: {
              $or: [{ user1Id: userId }, { user2Id: userId }],
              channelStatus: "active",
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
          matchId: match._id,
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
        console.log(userProfiles)
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
        const user1Exists = await userExists(user1Id);
        const user2Exists = await userExists(user2Id);

        if (!user1Exists || !user2Exists) {
          console.error(
            "One or both users do not exist. Channel creation aborted."
          );
          return {
            success: false,
            message: "One or both users do not exist.",
          };
        }

        // Create a group channel with the two users
        const channelUrl = await createChannel(
          [user1Id, user2Id],
          `${user1Id}__${user2Id} Chat`
        );

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
    async removeMatch(
      _,
      {
        matchId,
        reason,
        userId,
      }: { matchId: string; reason: string; userId: string }
    ) {
      try {
        // Connect to your data source and find the match
        const match = await Match.findById(matchId);
        if (!match) {
          return {
            success: false,
            message: "Match not found.",
            channelUrl: null,
            channelStatus: null,
          };
        }

        // Update match based on the reason provided
        if (reason === "reported") {
          match.channelStatus = "reported"; // Set the channel status to reported
          match.reportedBy = userId; // Set the reportedBy field to the userId of the reporter
        } else if (reason === "unmatched") {
          match.channelStatus = "archived"; // Default to archiving the match for other reasons
          match.reportedBy = ""; // Clear the reportedBy field unless it's a report case
        }

        await match.save();

        // Optionally handle the channel operations
        // For example, if you have an API to manage channel statuses:
        await hideSendbirdChannel(match.channelUrl);

        return {
          success: true,
          message: "Match status updated successfully.",
          channelUrl: match.channelUrl,
          channelStatus: match.channelStatus,
        };
      } catch (error) {
        console.error("Error updating match status:", error);
        return {
          success: false,
          message: "Failed to update the match status.",
          channelUrl: null,
          channelStatus: null,
        };
      }
    },
  },
};

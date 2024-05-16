import Match from '../../../models/Match';
import User from '../../../models/User';
//import SendBirdPlatformSdk from 'sendbird-platform-sdk';
import { groupChannelApi} from './../../../services/sendbirdService';


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
        // Create a group channel with the two users
        const createChannelData = {
          name: `${user1Id}-${user2Id} Chat`,
          user_ids: [user1Id, user2Id],
          is_distinct: true,
        };

      //const channel = await new Promise<SendBirdPlatformSdk.GroupChannel>(
  //(resolve, reject) => {
    //groupChannelApiInstance.gcCreateChannel(
      //apiToken,
      //createChannelData,
      //(error, data) => {
        //if (error) {
          //reject(error);
          //return;
        //}
        //resolve(data);
      //}
    //);
  //}
//);
    // Now create a match document with the new channel URL
        const newMatch = await Match.create({
          user1Id,
          user2Id,
          channelUrl: channel.url,
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

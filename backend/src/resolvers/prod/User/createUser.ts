import User from '../../../models/User';
import { PotentialMatchPool } from "../../../models/PotentialMatchPool";
import { resolvers as PotentialMatchPoolResolvers } from "../potentialMatchPools/updatePotentialMatchPool";
import { SHA256 } from 'crypto-js';
import _ from 'lodash'
import sanitize from 'mongo-sanitize'
import {
  createAWSUpload,
  deleteImagesFromS3
} from "../../../utils/awsUpload";
import {
  SWIPIES_PER_DAY_LIMIT,
  LIKES_PER_DAY_LIMIT,
  SPORT_CHANGES_PER_DAY,
} from "../../../constants";

export const resolvers = {
  Mutation: {
    registerNewPlayer: async (root, unSanitizedData, context) => {
      const {
        _id,
        image_set,
        firstName,
        lastName,
        gender,
        age,
        sport,
        neighborhood,
        description,
        phonenumber,
        email,
      } = sanitize(unSanitizedData);

      let data_set;
      let userDoc;
      let potentialMatchPoolDoc;

      try {
        data_set = await createAWSUpload(image_set, _id);
      } catch (error) {
        const uploadError =
          error instanceof Error
            ? error
            : new Error("Unknown error during AWS upload");
        console.error("Error during AWS upload:", uploadError.message);
        throw new Error(
          "Failed to upload images to AWS: " + uploadError.message
        );
      }

      try {
        console.log("User Document Created");

        // Generate filters and filtersHash
        const filters = {
          age: {
            min: Math.max(18, age - 5),
            max: Math.min(100, age + 5),
          },
          gameLevel: {
            min: Math.max(1, sport.gameLevel - 2),
            max: Math.min(8, sport.gameLevel + 2),
          },
        };
        const filtersString = JSON.stringify(filters);
        const filtersHash = SHA256(filtersString).toString();
        // Generate potential matches for the new user
        // Assume fetchMatchQueueForNewUser function is defined and imported
        const potentialMatches =
          await PotentialMatchPoolResolvers.Query.fetchMatchQueueForNewUser(
            _id,
            filters,
            filtersHash
          ); // Since the PotentialMatchPool document is created first, it ensures that
        // if user creation fails, there's a PotentialMatchPool document to rollback.
        potentialMatchPoolDoc = await PotentialMatchPool.create({
          userId: _id,
          potentialMatches: potentialMatches.map((match) => ({
            matchUserId: match.matchUserId, // Adjust as necessary
            firstName: match.firstName, // Assuming these fields are directly available from the aggregation
            image_set: match.image_set, // This should match the ImageSet[] structure
            age: match.age,
            neighborhood: match.neighborhood, // Ensure this matches the Neighborhood structure
            gender: match.gender,
            sport: match.sport, // Ensure this matches the Sport structure
            description: match.description, // Optional in your interface, so it's fine if it's not present in some documents
            createdAt: new Date(),
            updatedAt: new Date(),
            interacted: false,
          })),
          swipesPerDay: 30, // Default or calculated value
          filters: filters,
          filtersHash: filtersHash,
          dislikes: []
        });

        // Attempt to create User document
        userDoc = await User.create({
          _id: _id,
          image_set: data_set,
          firstName: firstName,
          lastName: lastName,
          gender: gender,
          age: age,
          neighborhood: neighborhood,
          sport: sport,
          description: description,
          phoneNumber: phonenumber,
          email: email,
          // Additional fields as required...
        });
        console.log("User Document Created");
      } catch (error) {
        console.error(
          "Error creating User document or PotentialMatchPool document:",
          error
        );

        // Rollback: Attempt to delete the PotentialMatchPool document if User creation fails
        if (userDoc == null && potentialMatchPoolDoc != null) {
          try {
            await PotentialMatchPool.findByIdAndDelete(
              potentialMatchPoolDoc._id
            );
            console.log("Rolled back PotentialMatchPool document creation.");
          } catch (rollbackError) {
            console.error(
              "Rollback failed for PotentialMatchPool document:",
              rollbackError
            );
            throw new Error(
              "Failed to rollback PotentialMatchPool document creation."
            );
          }
        }

        // Attempt to delete images from AWS S3 if document creation fails
        try {
          await deleteImagesFromS3(data_set);
          console.log(
            "Deletion of images completed after failed document creation."
          );
        } catch (deletionError) {
          console.error("Deletion failed:", deletionError);
        }

        throw new Error("Failed to complete registration process.");
      }

      // Return both the user document and the PotentialMatchPool document in the response
      return {
        user: userDoc,
        potentialMatchPool: potentialMatchPoolDoc,
      };
    },
  },
};

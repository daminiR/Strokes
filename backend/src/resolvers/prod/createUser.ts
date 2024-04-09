import User from '../../models/User';
import { PotentialMatchPool} from '../../models/PotentialMatchPool';
import { fetchPotentialMatchesForNewPlayer } from './../../services/userService';
import { SHA256 } from 'crypto-js';
import _ from 'lodash'
import sanitize from 'mongo-sanitize'
import {
  createAWSUpload,
  deleteImagesFromS3
} from "../../utils/awsUpload";
import {
  SWIPIES_PER_DAY_LIMIT,
  LIKES_PER_DAY_LIMIT,
  SPORT_CHANGES_PER_DAY,
} from "../../constants";

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
        newusertoken,
      } = sanitize(unSanitizedData);
      let data_set;
      let userDoc;
      let potentialMatchPoolDoc;
      // Handle errors for createAWSUpload separately
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

      // Attempt to create Squash document
      try {
        const preferences = {
          gameLevel: {
            min: Math.max(1, sport.gameLevel - 1), // Ensuring it doesn't go below 1
            max: sport.gameLevel + 1,
          },
          age: {
            min: age - 5,
            max: age + 5,
          },
        };
        const preferencesString = JSON.stringify(preferences);
        const preferencesHash = SHA256(preferencesString).toString();
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
          preferences: preferences,
          preferencesHash: preferencesHash,
          active: true,
          swipesPerDay: SWIPIES_PER_DAY_LIMIT + LIKES_PER_DAY_LIMIT,
          visableLikePerDay: LIKES_PER_DAY_LIMIT,
          sportChangesPerDay: SPORT_CHANGES_PER_DAY,
        });
        console.log("Squash Document Created");
      } catch (error) {
        const creationError =
          error instanceof Error
            ? error
            : new Error("Unknown error creating Squash document");
        console.error("Error creating Squash document:", creationError.message);

        // Attempt to delete images from S3 if document creation fails
        try {
          await deleteImagesFromS3(data_set);
          console.log(
            "Deletion of images completed after failed document creation."
          );
        } catch (deletionError) {
          const typedDeletionError =
            deletionError instanceof Error
              ? deletionError
              : new Error("Unknown error during deletion");
          console.error("Deletion failed:", typedDeletionError.message);
        }

        throw new Error(
          "Failed to create Squash document: " + creationError.message
        );
      }
      // Return the created document
      try {
        // This is a placeholder for your logic to generate potential matches based on your criteria.
        // Replace this with your actual logic to fetch potential matches.
        const potentialMatches = await fetchPotentialMatchesForNewPlayer(_id, {
          age,
          sport,
        });

        potentialMatchPoolDoc = await PotentialMatchPool.create({
          userId: _id,
          potentialMatches: potentialMatches.map((match) => ({
            matchUserId: match._id,
            createdAt: new Date(),
            updatedAt: new Date(),
            interacted: false,
          })),
        });

        console.log("PotentialMatchPool document created");
      } catch (error) {
        if (error instanceof Error) {
          console.error(
            "Error creating PotentialMatchPool document:",
            error.message
          );
          throw new Error(
            "Failed to create PotentialMatchPool document: " + error.message
          );
        } else {
          // Handle cases where 'error' might not be an Error object
          console.error("An unexpected error occurred", error);
          // Since 'error' is of type 'unknown', you can't directly concatenate it with a string.
          // You may choose to throw a generic error or handle it differently.
          throw new Error(
            "Failed to create PotentialMatchPool document due to an unexpected error."
          );
        }
      }

      // Return both the user document and the PotentialMatchPool document in the response
      // Adjust this return statement based on how you want to structure the response
      return {
        user: userDoc,
        potentialMatchPool: potentialMatchPoolDoc,
      };
    },
  },
};

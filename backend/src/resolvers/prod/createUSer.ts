import Squash from '../../models/Squash';
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
    uploadImage: async (root, unSanitizedData, context) => {
      return true;
    },
    createSquash2: async (root, unSanitizedData, context) => {
      const {
        _id,
        image_set,
        firstName,
        lastName,
        gender,
        age,
        sports,
        neighborhood,
        description,
        phonenumber,
        email,
        newusertoken,
      } = sanitize(unSanitizedData);

      let data_set;
      let doc;

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
        doc = await Squash.create({
          _id: _id,
          image_set: data_set,
          firstName: firstName,
          lastName: lastName,
          gender: gender,
          age: age,
          neighborhood: neighborhood,
          sports: sports,
          description: description,
          phoneNumber: phonenumber,
          email: email,
          active: true,
          swipesPerDay: SWIPIES_PER_DAY_LIMIT + LIKES_PER_DAY_LIMIT,
          visableLikePerDay: LIKES_PER_DAY_LIMIT ,
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
      return doc;
    },
  },
};

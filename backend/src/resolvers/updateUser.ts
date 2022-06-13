import Squash from '../models/Squash';
import _ from 'lodash'
import {
  deleteFilesFromAWS,
  createAWSUpload,
} from "../utils/awsUpload";
import {
  SPORT_CHANGES_PER_DAY,
} from "../constants/";
import sanitize from 'mongo-sanitize'
import { AuthenticationError }  from 'apollo-server-express';

export const resolvers = {
  Query: {
    squash: async (parents, unSanitizedId, context, info) => {
      const { id } = sanitize(unSanitizedId);
      console.log("id in sqash", id)
      const squash_val = await Squash.findById(id);
      return squash_val;
    },
    squashes: async (parents, unSanitizedId, context, info) => {
      //const user = context.user;
      const { id } = sanitize(unSanitizedId);
      //if (user?.sub != id) throw new AuthenticationError("not logged in");
      const squashes = await Squash.find({ id });
      return squashes;
    },
  },
  Mutation: {
    updateUserProfile: async (root, unSanitizedData, context) => {
      const {
        _id,
        image_set,
        first_name,
        last_name,
        gender,
        age,
        sports,
        location,
        description,
        remove_uploaded_images,
        add_local_images,
        original_uploaded_image_set,
      } = sanitize(unSanitizedData);

      //const user = context.user;
      //if (user?.sub != _id) throw new AuthenticationError("not logged in");

      const removed_image_set = await deleteFilesFromAWS(
        remove_uploaded_images,
        original_uploaded_image_set,
        add_local_images.length
      );
      const data_set = await createAWSUpload(add_local_images, _id);
      const final_image_set = removed_image_set.concat(data_set);
      const check_doc_sports = await Squash.findById(_id);
      var sportChangesPerDay = check_doc_sports?.sportChangesPerDay;
      const sportsOld = _.map(check_doc_sports?.sports, (sportObj) => {
        return sportObj.sport;
      });
      const sportsNew = _.map(sports, (sportObj) => {
        return sportObj.sport;
      });
      if (!_.isEqual(check_doc_sports?.sports, sports)) {
        sportChangesPerDay = sportChangesPerDay
          ? sportChangesPerDay - 1
          : SPORT_CHANGES_PER_DAY;
      }
      const doc = await Squash.findOneAndUpdate(
        { _id: _id },
        {
          $set: {
            _id: _id,
            image_set: final_image_set,
            first_name: first_name,
            last_name: last_name,
            gender: gender,
            location: location,
            age: age,
            sports: sports,
            description: description,
            sportChangesPerDay: sportChangesPerDay,
          },
        },
        { new: true }
      );
      return doc;
    },
  },
};

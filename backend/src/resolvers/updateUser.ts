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


export const resolvers = {
  Query: {
    squash: async (parents, unSanitizedId, context, info) => {
      const {_id} = sanitize(unSanitizedId)
      const squash_val = await Squash.findById(_id)
      console.log(squash_val);
      return squash_val;
    },
    squashes: async (parents, unSanitizedId, context, info) => {
      const {_id} =  sanitize(unSanitizedId)
      const squashes = await Squash.find({_id});
      return squashes;
    },
  },
  Mutation: {
    updateUserProfile: async (
      root,
      unSanitizedData,
    ) => {
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
      } = sanitize(unSanitizedData)
      //const removed_image_set = await deleteFilesFromGC(remove_uploaded_images, original_uploaded_image_set, add_local_images.length);
      const removed_image_set = await deleteFilesFromAWS(remove_uploaded_images, original_uploaded_image_set, add_local_images.length);
      //const data_set = await creatGCUpload(add_local_images, _id)
      const data_set = await createAWSUpload(add_local_images, _id)
      const final_image_set = removed_image_set.concat(data_set)
      // if sport changes decrement sportsPerDay
      const check_doc_sports = await Squash.findById( _id);
      var sportChangesPerDay = check_doc_sports?.sportChangesPerDay
      // only check if list of sports are the same, user shoul dbe allowed to change gamelevels freely
      const sportsOld = _.map(check_doc_sports?.sports, (sportObj) => {return sportObj.sport})
      const sportsNew = _.map(sports, (sportObj) => {return sportObj.sport})
      //if (!_.isEqual(sportsOld, sportsNew)) {
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
    return doc
    },
  }
}

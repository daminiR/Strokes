import Squash from '../models/Squash';
import Message from '../models/Messages';
import { GraphQLUpload } from 'graphql-upload'
import { ObjectId} from 'mongodb'
import { sanitizeFile } from '../utils/fileNaming'
import { acsport1 } from '../index'
import * as path from 'path';
import _ from 'lodash'
import {Data, DisplayData} from '../types/Squash'
import {
  deleteAllUserImages,
  creatGCUpload,
  deleteFilesFromGC,
  deleteFromGC,
} from "../utils/googleUpload";
import {
  SWIPIES_PER_DAY_LIMIT,
  LIKES_PER_DAY_LIMIT,
  SPORT_CHANGES_PER_DAY,
  dest_gcs_images,
  POST_CHANNEL
} from "../constants/";


export const resolvers = {
  Query: {
    squash: async (parents, args, context, info) => {
      const squash_val = await Squash.findById(args.id)
      console.log(squash_val);
      return squash_val;
    },
    squashes: async (parents, args, context, info) => {
      const squashes = await Squash.find({});
      return squashes;
    },
  },
  Mutation: {
    //////////////////////////////////////// JMETER Testing MUtations ////////////////////////////////////////////////
    updateLocation: async (parents, {check}, context, info) => {
      const locationAll = {
        city: "Cambridge",
        state: "MA",
        country: "US"
      }
        const docs = await Squash.updateMany(
          {},
          { $set: { location: locationAll } },
          { new: true }
        );
        console.log("Updated user location changes", docs);
        return "Done";
    },
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    updateUserSports: async (parents, { _id, sportsList }, context, info) => {
      if (sportsList.length != 0) {
        const doc = await Squash.findOneAndUpdate(
          { _id: _id },
          { $set: { sports: sportsList } },
          { new: true }
        );
        console.log("Updated user squash changes");
      }
      return _id;
    },
    updateName: async (
      parents,
      { _id, first_name, last_name },
      context,
      info
    ) => {
      console.log("did we get here");
      if (first_name.length != 0) {
        const doc = await Squash.findOneAndUpdate(
          { _id: _id },
          { $set: { first_name: first_name, last_name: last_name } },
          { new: true }
        );
        console.log("Updated user first name ", first_name, last_name);
      } else {
        console.log("Name cannot be no length");
      }
      return _id;
    },
    updateAge: async (parents, { _id, age }, context, info) => {
      if (age != 0) {
        const doc = await Squash.findOneAndUpdate(
          { _id: _id },
          { $set: { age: age } },
          { new: true }
        );
        console.log("Updated user age ", age);
      } else {
        console.log("Age cannot be no length");
      }
      return _id;
    },
    updateGender: async (parents, { _id, gender }, context, info) => {
      //if (gender != 0) {
      const doc = await Squash.findOneAndUpdate(
        { _id: _id },
        { $set: { gender: gender } },
        { new: true }
      );
      console.log("Updated user gender ", gender);
      //} else {
      //console.log("Age cannot be no length");
      //}
      return _id;
    },
    updateDescription: async (parents, { _id, description }, context, info) => {
      //if (gender != 0) {
      const doc = await Squash.findOneAndUpdate(
        { _id: _id },
        { $set: { description: description } },
        { new: true }
      );
      console.log("Updated user description ", description);
      //} else {
      //console.log("Age cannot be no length");
      //}
      return _id;
    },
    updateUserProfile: async (
      root,
      {
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
      }
    ) => {
      // remove from gc
      const removed_image_set = await deleteFilesFromGC(remove_uploaded_images, original_uploaded_image_set, add_local_images.length);
      const data_set = await creatGCUpload(add_local_images, _id)
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

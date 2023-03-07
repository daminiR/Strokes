import Squash from '../models/Squash';
import { GraphQLUpload } from 'graphql-upload'
import { ObjectId} from 'mongodb'
import { sanitizeFile } from '../utils/fileNaming'
import sanitize from 'mongo-sanitize'
import * as path from 'path';
import _ from 'lodash'
import {Data, DisplayData} from '../types/Squash'
import {
  createAWSUpload,
} from "../utils/awsUpload";
import {
  SWIPIES_PER_DAY_LIMIT,
  LIKES_PER_DAY_LIMIT,
  SPORT_CHANGES_PER_DAY,
} from "../constants/";
//import { PubSub } from 'graphql-subscriptions';
//const pubsub = new PubSub()
export const resolvers = {
  Mutation: {
    removeMatchesDummy: async (
      root,
      unSanitizedData,
      context,
    ) => {
      //const data_set = await createAWSUpload(image_set, _id);
      const matched_id = "14683ec0-46bb-4b56-ade5-3424af8e9719"
      const current_id = "ba98a8c9-5939-4418-807b-320fdc0e0fec"
      const current = await Squash.findOneAndUpdate(
        { _id: current_id},
        { $pull:
           {
             "matches": {"_id": matched_id} ,
             "likes": matched_id,
          },
        },
        { new: true }
      );
      const matched = await Squash.findOneAndUpdate(
        { _id: matched_id},
        { $pull:
           {
             "matches": {"_id": current_id} ,
             "likedByUSers": current_id,
          },
        },
        { new: true }
      );
      console.log("Reseted matches")
      return "done";
    },
    createSquashTestSamples: async (
      root,
      unSanitizedData,
      context,
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
        phoneNumber,
        email
      } = sanitize(unSanitizedData);

      //const data_set = await createAWSUpload(image_set, _id);
      const isFound = await Squash.findOne(
        { _id:_id},
        { new: true }
      );
      console.log("did we find it", isFound, _id)
      if(isFound !== null) {
      const doc = await Squash.remove(
        { _id:_id},
      )
      }
      const doc = await Squash.create({
        _id: _id,
        image_set: image_set,
        first_name: first_name,
        last_name: last_name,
        gender: gender,
        age: age,
        location: location,
        sports: sports,
        description: description,
        phoneNumber: phoneNumber,
        email: email,
        matches: [],
        likes: ["ba98a8c9-5939-4418-807b-320fdc0e0fec"],
        active: true,
        swipesPerDay: SWIPIES_PER_DAY_LIMIT + LIKES_PER_DAY_LIMIT,
        visableLikePerDay: LIKES_PER_DAY_LIMIT,
        sportChangesPerDay: SPORT_CHANGES_PER_DAY,
      });
      const profileImage = _.find(doc?.image_set, imgObj => {imgObj.img_idx == 0})
      const likedByUser = {
        first_name: doc?.first_name,
        _id: _id,
        age: doc?.age,
        gender: doc?.gender,
        sports: doc?.sports,
        description: doc?.description,
        image_set: doc?.image_set,
        location: doc?.location,
      };
      //const update = { $addToSet: { likedByUSers: likedByUser}}
      const doc1 = await Squash.findOneAndUpdate(
        { _id:"ba98a8c9-5939-4418-807b-320fdc0e0fec"},
        { $addToSet: { likedByUSers: likedByUser }},
        //{ likedByUSers: [ likedByUser ] },
        { new: true }
      );
      console.log(doc);
      console.log(doc1);
      return doc;
    },
  }
}

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
//import { PubSub } from 'graphql-subscriptions';
import { pubsub } from '../pubsub'
//const pubsub = new PubSub()
export const resolvers = {
  Mutation: {
    updateGameLevelsToStrings: async (parents, context, info) => {
        //const doc = await Squash.updateMany(
          //{ _id: ["aoshwaakxrywljjshsgxuvytfzlm"]},
          //{ $set: {"sports.$[].game_level":  '1'}},
          //{ new: true }
        //);
        console.log("tetsing")
      //return doc;
    },
    updateLikesTestSamples: async (parents, { _id, likes}, context, info) => {
      const doc = await Squash.findOneAndUpdate(
        { _id: _id },
        { $addToSet: { likes: { $each: likes } } },
        { new: true }
      );
      const profileImage = _.find(doc?.image_set, imgObj => {imgObj.img_idx == 0})
      const likedByUser = {
        first_name: doc?.first_name,
        _id: _id,
        age: doc?.age,
        profileImage: profileImage,
      };
      const filter = {_id: likes}
      const update = { $addToSet: { likedByUSers: likedByUser}}
      await Squash.updateMany(filter, update)
      return doc;
    },
    updateLikesCurrentUserTestSamples: async (parents, { _id, likes}, context, info) => {
      /// function different from the pther updateLikes
      const likeIDs = _.map(likes, likeObj => {
        return likeObj._id
      })
      const likedDocs = await Squash.updateMany(
        { _id: {$in : likeIDs} },
        { $addToSet: { likes:  _id } },
        { new: true }
      );
      const filter = {_id: _id}
      const update = { $addToSet: { likedByUSers: {$each : likes}}}
      const doc = await Squash.findOneAndUpdate(filter, update)
      return doc;
    },
    updateUserProfileTestSamples: async (parents, { _id1, _id2 }, context, info) => {
        const doc = await Squash.updateMany(
          {},
          //{ $pull: { matches: {}, likes: {}, likedByUSers: {}} },
          { $set: {"sports.$[].game_level": _.random(0,2).toString()}},
          { new: true }
        );
        console.log("tetsing", doc)
      return doc;
    },
    createSquashTestSamples: async (
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
      }
    ) => {
      const doc = await Squash.create({
          _id: _id,
          image_set: image_set,
          first_name: first_name,
          last_name: last_name,
          gender: gender,
          age: age,
          sports: sports,
          location: location,
          description: description,
          swipesPerDay: SWIPIES_PER_DAY_LIMIT + LIKES_PER_DAY_LIMIT,
          visableLikePerDay: LIKES_PER_DAY_LIMIT,
          sportChangesPerDay: SPORT_CHANGES_PER_DAY,
          i_blocked: [],
          blocked_me: [],
          likes: [],
          dislikes: [],
          active: true,
        });
        console.log(doc);
        return doc;
    },
    testMut(root, args){
      return args.name
    },
  }
}

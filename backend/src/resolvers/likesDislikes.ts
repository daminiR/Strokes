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
  Query: {
    getSwipesPerDay: async (parents, { _id }, context, info) => {
      const user = await Squash.findById(_id);
      return user ? user.swipesPerDay : 0;
    }
  },
    Mutation: {
      updateLikes: async (
        parents,
        { _id, likes, currentUserData, isFromLikes },
        context,
        info
      ) => {
        // the one who swiped get one less swipe so for _id, decease swipe
        // only upser documents if likes/dislikes are more than 0
        console.log("what is isFromLikes", isFromLikes);
        if (!isFromLikes) {
          const doc = await Squash.findOneAndUpdate(
            { $and: [{ _id: _id }, { $gt: { swipesPerDay: 0 } }] },
            {
              $addToSet: { likes: { $each: likes } },
              $inc: { swipesPerDay: -1 },
            },
            { new: true }
          );
          const filter = { _id: likes };
          //const profileImage = _.find(doc?.image_set, (imgObj) => {
          //imgObj.img_idx == 0;
          //});
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
          const update = { $addToSet: { likedByUSers: likedByUser } };
          await Squash.updateMany(filter, update);
          return doc;
        } else {
          const doc = await Squash.findOneAndUpdate(
            {
              $and: [
                { _id: _id },
                { $gt: { swipesPerDay: 0, visableLikePerDay: 0 } },
              ],
            },
            {
              $addToSet: { likes: { $each: likes } },
              $inc: { swipesPerDay: -1, visableLikePerDay: -1 },
            },
            { new: true }
          );
          const filter = { _id: likes };
          //const profileImage = _.find(doc?.image_set, (imgObj) => {
          //imgObj.img_idx == 0;
          //});
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
          const update = { $addToSet: { likedByUSers: likedByUser } };
          await Squash.updateMany(filter, update);
          return doc;
        }
      },
      updateDislikes: async (
        parents,
        { _id, dislikes, isFromLikes },
        context,
        info
      ) => {
        // todo: create dilikedby users list, users that didnt like you so you done need to show these
        if (!isFromLikes) {
          const doc = await Squash.findOneAndUpdate(
            { $and: [{ _id: _id }, { $gt: { swipesPerDay: 0 } }] },
            {
              $addToSet: { dislikes: { $each: dislikes } },
              $inc: { swipesPerDay: -1 },
            },
            { new: true }
          );
          console.log("Updated user dislikes ", dislikes);
          console.log("doc", doc);
          return doc;
        } else {
          const doc = await Squash.findOneAndUpdate(
            {
              $and: [
                { _id: _id },
                { $gt: { swipesPerDay: 0, visableLikePerDay: 0 } },
              ],
            },
            {
              $addToSet: { dislikes: { $each: dislikes } },
              $inc: { swipesPerDay: -1, visableLikePerDay: -1 },
            },
            { new: true }
          );
          console.log("Updated user dislikes ", dislikes);
          console.log("doc", doc);
          return doc;
        }
      },
  },
};

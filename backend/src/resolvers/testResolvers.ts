import Squash from '../models/Squash';
import _ from 'lodash'
import sanitize from 'mongo-sanitize'
import {
  SWIPIES_PER_DAY_LIMIT,
  LIKES_PER_DAY_LIMIT,
  SPORT_CHANGES_PER_DAY,
} from "../constants/";
export const resolvers = {
  Mutation: {
    updateGameLevelsToStrings: async (parents, context, info) => {
      //const doc = await Squash.updateMany(
      //{ _id: ["aoshwaakxrywljjshsgxuvytfzlm"]},
      //{ $set: {"sports.$[].game_level":  '1'}},
      //{ new: true }
      //);
      console.log("tetsing");
      //return doc;
    },
    updateLikesTestSamples: async (parents, unSanitizedData, context, info) => {
      const { _id, likes } = sanitize(unSanitizedData);
      const doc = await Squash.findOneAndUpdate(
        { _id: _id },
        { $addToSet: { likes: { $each: likes } } },
        { new: true }
      );
      const profileImage = _.find(doc?.image_set, (imgObj) => {
        imgObj.img_idx == 0;
      });
      const likedByUser = {
        first_name: doc?.first_name,
        _id: _id,
        age: doc?.age,
        profileImage: profileImage,
      };
      const filter = { _id: likes };
      const update = { $addToSet: { likedByUSers: likedByUser } };
      await Squash.updateMany(filter, update);
      return doc;
    },
    updateLikesCurrentUserTestSamples: async (
      parents,
      unSanitizedData,
      context,
      info
    ) => {
      const { _id, likes } = sanitize(unSanitizedData);
      /// function different from the pther updateLikes
      const likeIDs = _.map(likes, (likeObj) => {
        return likeObj._id;
      });
      const likedDocs = await Squash.updateMany(
        { _id: { $in: likeIDs } },
        { $addToSet: { likes: _id } },
        { new: true }
      );
      const filter = { _id: _id };
      const update = { $addToSet: { likedByUSers: { $each: likes } } };
      const doc = await Squash.findOneAndUpdate(filter, update);
      return doc;
    },
    updateUserProfileTestSamples: async (
      parents,
      unSanitizedData,
      context,
      info
    ) => {
      const { _id1, _id2 } = sanitize(unSanitizedData);
      const doc = await Squash.findOneAndUpdate(
        { _id: _id2 },
        { $pull: { matches: {}, likes: {}, likedByUSers: {} } }
        //{ $set: {"sports.$[].game_level": _.random(0,2).toString()}},
        //{ new: true }
      );
      console.log("tetsing", doc);
      return doc;
    },
    testSb: async (parents, unSanitizedData, context, info) => {
      const { _id, other_id } = sanitize(unSanitizedData);
      const doc = await Squash.findOneAndUpdate(
        { _id: _id },
        { $pull: { matches: {}, likes: {} } }
        //{ $set: {"sports.$[].game_level": _.random(0,2).toString()}},
        //{ new: true }
      );
      const doc2 = await Squash.findOneAndUpdate(
        { _id: other_id },
        { $pull: { matches: {}, likedByUSers: {} } }
        //{ $set: {"sports.$[].game_level": _.random(0,2).toString()}},
        //{ new: true }
      );
      console.log("tetsing", doc);
      return doc;
    },
    createSquashTestSamples: async (
      root,
      unSanitizedData
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
      } = sanitize(unSanitizedData)
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
    testMut(root, args) {
      return args.name;
    },
  },
};
